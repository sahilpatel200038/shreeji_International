<?php

namespace App\Services;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Models\TrackingEvent;
use App\Services\Tracking\CarrierTrackingManager;
use App\Services\Tracking\Exceptions\CarrierNotFoundException;
use App\Services\Tracking\Exceptions\CarrierTrackingException;
use App\Services\Tracking\TrackingResult;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ShipmentService
{
    private const ACX_CARRIER_CODE = 'ACX';

    private const PATEL_CARRIER_CODE = 'PATEL';

    private const SSCF_CARRIER_CODE = 'SSCF';

    private const HISPEED_CARRIER_CODE = 'HISPEED';

    /**
     * @var array<string, string> carrier code => display name, used when a
     *      first-time lookup creates the courier_providers row on demand.
     */
    private const CARRIER_NAMES = [
        self::ACX_CARRIER_CODE => 'ACX International',
        self::PATEL_CARRIER_CODE => 'Patel International Courier',
        self::SSCF_CARRIER_CODE => 'SSCF',
        self::HISPEED_CARRIER_CODE => 'HiSpeed International Courier',
    ];

    /**
     * Order in which a brand-new tracking number is tried against each
     * carrier's API. The lookup stops at the first carrier that returns a
     * valid result later carriers in this list are never called once one
     * succeeds (see createShipmentFromCarrierLookup()).
     *
     * @var string[]
     */
    private const CARRIER_LOOKUP_ORDER = [
        self::ACX_CARRIER_CODE,
        self::PATEL_CARRIER_CODE,
        self::SSCF_CARRIER_CODE,
        self::HISPEED_CARRIER_CODE,
    ];

    public function __construct(private readonly CarrierTrackingManager $carrierTrackingManager) {}

    public function createShipment(array $data, ?Carbon $createdEventTime = null): Shipment
    {
        $data['status'] = $data['status'] ?? 'created';

        $shipment = Shipment::create($data);

        $this->recordEvent($shipment, [
            'status' => $shipment->status,
            'location' => $shipment->origin_city ?? $shipment->origin_country,
            'description' => 'Shipment created and registered in the system.',
            'event_time' => $createdEventTime ?? Carbon::now(),
        ]);

        return $shipment;
    }

    public function recordEvent(Shipment $shipment, array $eventData): TrackingEvent
    {
        $event = $shipment->trackingEvents()->create([
            'status' => $eventData['status'],
            'location' => $eventData['location'] ?? null,
            'description' => $eventData['description'] ?? null,
            'event_time' => $eventData['event_time'] ?? Carbon::now(),
            'source' => $eventData['source'] ?? 'manual',
        ]);

        $shipment->status = $eventData['status'];
        if (! empty($eventData['location'])) {
            $shipment->current_location = $eventData['location'];
        }
        if ($eventData['status'] === 'delivered' && ! $shipment->actual_delivery_date) {
            $shipment->actual_delivery_date = $eventData['event_time'] ?? Carbon::now();
        }
        $shipment->save();

        return $event;
    }

    /**
     * Look up a tracking number for the public tracking page. If a local
     * shipment record already exists it is refreshed from ACX; otherwise a
     * new record is created straight from the ACX response so that every
     * tracking number ever searched ends up managed in the admin panel.
     *
     * @throws \App\Services\Tracking\Exceptions\CarrierTrackingException when
     *         no local record exists yet and ACX itself cannot be reached or
     *         does not recognise the tracking number.
     */
    public function trackByNumber(string $trackingNumber): Shipment
    {
        $shipment = Shipment::with(['courierProvider', 'trackingEvents'])
            ->where('tracking_number', $trackingNumber)
            ->first();

        if ($shipment) {
            return $this->syncTrackingFromCarrier($shipment);
        }

        return $this->createShipmentFromCarrierLookup($trackingNumber);
    }

    /**
     * Pull live tracking from the shipment's own carrier (per its
     * courier_provider.code one of CARRIER_LOOKUP_ORDER) and mirror it
     * into tracking_events (source = carrier). Manual events are never
     * touched. Failures are recorded on the shipment rather than thrown, so
     * callers (especially the public tracking page) never break on a
     * carrier outage. Shipments linked to a provider with no tracking
     * integration (e.g. manually entered) are left untouched rather than
     * guessed at. Only the shipment's own carrier is ever queried here —
     * there is no fallback to other carriers on a resync.
     */
    public function syncTrackingFromCarrier(Shipment $shipment, bool $force = false): Shipment
    {
        $ttlMinutes = (int) config('services.tracking.cache_ttl_minutes', 15);

        if (! $force && $shipment->last_synced_at && $shipment->last_synced_at->gt(Carbon::now()->subMinutes($ttlMinutes))) {
            return $shipment;
        }

        $carrierCode = $shipment->courierProvider?->code;

        if (! $carrierCode || ! $this->carrierTrackingManager->supports($carrierCode)) {
            return $shipment;
        }

        Log::info('tracking.sync.attempt', ['tracking_number' => $shipment->tracking_number, 'carrier' => $carrierCode]);

        try {
            $result = $this->carrierTrackingManager->resolve($carrierCode)->track($shipment->tracking_number);
        } catch (CarrierTrackingException $e) {
            Log::info('tracking.sync.miss', [
                'tracking_number' => $shipment->tracking_number,
                'carrier' => $carrierCode,
                'reason' => $e->getMessage(),
            ]);

            $shipment->last_sync_error = $e->getMessage();
            $shipment->last_synced_at = Carbon::now();
            $shipment->save();

            return $shipment;
        }

        Log::info('tracking.sync.success', ['tracking_number' => $shipment->tracking_number, 'carrier' => $carrierCode]);

        $this->applySyncResult($shipment, $result);

        return $shipment->fresh(['courierProvider', 'trackingEvents']);
    }

    /**
     * First-time lookup of a tracking number that has no local shipment yet.
     * Tries each carrier in CARRIER_LOOKUP_ORDER in turn and stops
     * immediately at the first one that returns a valid result later
     * carriers in the list are never called once one succeeds. If no
     * carrier recognises the number, throws the first "not found" error
     * seen (more informative than a misconfiguration/outage error from a
     * carrier that was never actually tried against this number).
     */
    private function createShipmentFromCarrierLookup(string $trackingNumber): Shipment
    {
        $result = null;
        $carrierCode = null;
        $firstNotFoundError = null;
        $firstError = null;

        foreach (self::CARRIER_LOOKUP_ORDER as $code) {
            try {
                Log::info('tracking.lookup.attempt', ['tracking_number' => $trackingNumber, 'carrier' => $code]);
                $result = $this->carrierTrackingManager->resolve($code)->track($trackingNumber);
                $carrierCode = $code;
                Log::info('tracking.lookup.success', ['tracking_number' => $trackingNumber, 'carrier' => $code]);

                // Stop-after-success: a valid result was found, so the
                // remaining carriers in CARRIER_LOOKUP_ORDER are skipped.
                break;
            } catch (CarrierTrackingException $e) {
                Log::info('tracking.lookup.miss', [
                    'tracking_number' => $trackingNumber,
                    'carrier' => $code,
                    'reason' => $e->getMessage(),
                ]);

                $firstError ??= $e;
                if ($e instanceof CarrierNotFoundException) {
                    $firstNotFoundError ??= $e;
                }
            }
        }

        if ($carrierCode === null) {
            throw $firstNotFoundError ?? $firstError;
        }

        $provider = CourierProvider::firstOrCreate(
            ['code' => $carrierCode],
            ['name' => self::CARRIER_NAMES[$carrierCode], 'is_active' => true]
        );

        $shipment = Shipment::create([
            'tracking_number' => $trackingNumber,
            'reference_number' => $result->referenceNumber,
            'courier_provider_id' => $provider->id,
            'sender_name' => $result->senderName ?: 'Unknown',
            'receiver_name' => $result->receiverName ?: 'Unknown',
            'origin_country' => $result->originCountry ?: 'Unknown',
            'origin_city' => $result->originCity,
            'destination_country' => $result->destinationCountry ?: 'Unknown',
            'destination_city' => $result->destinationCity,
            'package_description' => $result->packageDescription,
            'weight_kg' => $result->weightKg,
            'status' => $result->status,
        ]);

        $this->applySyncResult($shipment, $result);

        return $shipment->fresh(['courierProvider', 'trackingEvents']);
    }

    private function applySyncResult(Shipment $shipment, TrackingResult $result): void
    {
        $shipment->trackingEvents()->where('source', 'carrier')->delete();

        if ($result->events !== []) {
            $now = Carbon::now();
            $rows = array_map(fn ($event) => [
                'shipment_id' => $shipment->id,
                'status' => $event->status,
                'location' => $event->location,
                'description' => $event->description,
                'event_time' => $event->eventTime,
                'source' => 'carrier',
                'created_at' => $now,
                'updated_at' => $now,
            ], $result->events);

            // Bulk insert instead of one create() per event: a carrier can
            // return dozens of docket events, and N sequential INSERTs (plus
            // N Eloquent model hydrations) were adding avoidable latency to
            // every tracking lookup for no behavioral difference.
            TrackingEvent::insert($rows);
        }

        $shipment->status = $result->status;
        $shipment->carrier_raw_status = $result->rawStatus;
        if ($result->currentLocation) {
            $shipment->current_location = $result->currentLocation;
        }
        if ($result->estimatedDelivery) {
            $shipment->estimated_delivery_date = $result->estimatedDelivery;
        }
        if ($result->status === 'delivered' && ! $shipment->actual_delivery_date) {
            $shipment->actual_delivery_date = $result->actualDeliveryDate ?? Carbon::now();
        }
        if ($result->rawResponse !== null) {
            $shipment->carrier_raw_response = $result->rawResponse;
        }
        $shipment->last_sync_error = null;
        $shipment->last_synced_at = Carbon::now();
        $shipment->save();
    }
}
