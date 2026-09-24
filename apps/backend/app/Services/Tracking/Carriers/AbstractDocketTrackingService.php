<?php

namespace App\Services\Tracking\Carriers;

use App\Services\Tracking\Exceptions\CarrierAuthException;
use App\Services\Tracking\Exceptions\CarrierNotFoundException;
use App\Services\Tracking\TrackingEventData;
use App\Services\Tracking\TrackingResult;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

/**
 * Shared implementation for every carrier exposing the same white-label
 * docket/tracking_api response shape:
 * GET {base}/api/tracking_api/get_tracking_data?api_company_id=&customer_code=&tracking_no=
 *
 * Concrete carriers (ACX, Patel, SSCF, HiSpeed, ...) only need to supply
 * which config namespace holds their base_url/company_id/customer_code.
 */
abstract class AbstractDocketTrackingService extends AbstractCarrierTrackingService
{
    /**
     * Ordered keyword => internal status map, checked against the docket's
     * top-level "Status" field first, then the latest event description.
     * More specific phrases are listed before the generic ones they contain.
     */
    private const STATUS_MAP = [
        'delivered' => 'delivered',
        'out for delivery' => 'out_for_delivery',
        'customs cleared' => 'customs_cleared',
        'awaiting customs clearance' => 'customs_clearance',
        'customs clearance' => 'customs_clearance',
        'customs' => 'customs_clearance',
        'departed' => 'departed_origin',
        'arrived at destination' => 'arrived_destination_country',
        'arrived at hub' => 'at_origin_facility',
        'arrived hub' => 'in_transit',
        'shipment arrived' => 'in_transit',
        'prepared for export' => 'at_origin_facility',
        'booked' => 'picked_up',
        'rto' => 'returned',
        'return' => 'returned',
        'cancel' => 'cancelled',
        'exception' => 'exception',
        'undelivered' => 'delivery_attempted',
    ];

    /**
     * The config('services.*') key holding this carrier's base_url,
     * company_id and customer_code (e.g. 'acx', 'sscf').
     */
    abstract protected function configKey(): string;

    /**
     * The env var names shown in the "not configured" auth exception,
     * e.g. 'ACX_API_COMPANY_ID / ACX_CUSTOMER_CODE'.
     */
    abstract protected function authErrorLabel(): string;

    /**
     * Docket API's inconsistent singular "custom" vs plural "customs"
     * across event descriptions for the same shipment. Normalize to
     * "customs" so STATUS_MAP's customs keywords match either form.
     */
    private function normalizeStatusText(?string $text): ?string
    {
        if ($text === null) {
            return null;
        }

        return preg_replace('/\bcustom\b/i', 'customs', $text);
    }

    public function track(string $trackingNumber): TrackingResult
    {
        $key = $this->configKey();
        $companyId = config("services.{$key}.company_id");
        $customerCode = config("services.{$key}.customer_code");

        if (empty($companyId) || empty($customerCode)) {
            throw new CarrierAuthException("{$this->authErrorLabel()} are not configured.");
        }

        // Real-world responses from these carriers land well under 1.5s; the
        // timeout only matters when a carrier is unreachable. With up to 4
        // carriers tried sequentially per lookup, keeping this tight bounds
        // the worst case instead of letting one bad carrier stall the chain.
        $connectTimeout = (int) config('services.tracking.connect_timeout_seconds', 5);
        $requestTimeout = (int) config('services.tracking.request_timeout_seconds', 8);

        $response = $this->guardTimeout(fn () => Http::connectTimeout($connectTimeout)->timeout($requestTimeout)->get(
            rtrim(config("services.{$key}.base_url"), '/').'/api/tracking_api/get_tracking_data',
            [
                'api_company_id' => $companyId,
                'customer_code' => $customerCode,
                'tracking_no' => $trackingNumber,
            ]
        ));

        $this->assertSuccessful($response, 'No shipment found for this tracking number.');

        $body = $response->json();
        $data = is_array($body) && array_is_list($body) ? ($body[0] ?? null) : $body;

        if (! is_array($data) || ($data['errors'] ?? false) === true || empty($data['tracking_no'])) {
            throw new CarrierNotFoundException('No shipment found for this tracking number.');
        }

        $info = $this->docketInfo($data['docket_info'] ?? []);
        $rawEvents = collect($data['docket_events'] ?? [])->filter(fn ($event) => is_array($event));

        $events = $rawEvents->map(fn (array $event) => new TrackingEventData(
            status: $this->mapStatus(self::STATUS_MAP, $this->normalizeStatusText($event['event_description'] ?? $event['event_state'] ?? null)),
            location: $event['event_location'] !== '' ? ($event['event_location'] ?? null) : null,
            description: $event['event_description'] !== '' ? ($event['event_description'] ?? null) : null,
            eventTime: isset($event['event_at']) ? Carbon::parse($event['event_at']) : Carbon::now(),
        ))->all();

        $latestEvent = $rawEvents->sortByDesc(fn (array $event) => $event['event_at'] ?? '')->first();

        // docket_events are not always in real-world chronological order by
        // event_at (e.g. a customs event can be timestamped after the
        // delivery event on the same day), so the authoritative top-level
        // "Status" field is trusted over "latest event" for overall status.
        $rawStatus = $info->get('Status');
        $status = $this->mapStatus(
            self::STATUS_MAP,
            $this->normalizeStatusText($rawStatus ?: ($latestEvent['event_description'] ?? null))
        );

        $originCity = $info->get('Origin_city') ?: $info->get('Shipper City');
        $destinationCity = $info->get('Destinantion_city') ?: $info->get('Consignee City');

        return new TrackingResult(
            status: $status,
            rawStatus: $rawStatus,
            currentLocation: $latestEvent['event_location'] ?? null,
            estimatedDelivery: $data['expected_datetime'] ?? null,
            events: $events,
            actualDeliveryDate: $status === 'delivered' ? ($info->get('Delivery Date and Time') ?: null) : null,
            senderName: $info->get('Shipper Name') ?: $info->get('Shipper Company'),
            receiverName: $info->get('Consignee Name') ?: $info->get('Consignee Company'),
            originCountry: $info->get('Origin'),
            originCity: $originCity ?: null,
            destinationCountry: $info->get('Destination'),
            destinationCity: $destinationCity ?: null,
            referenceNumber: $data['forwarding_no'] ?: null,
            weightKg: $data['chargeable_weight'] ?: null,
            packageDescription: $data['item_data'] ?: null,
            rawResponse: $data,
        );
    }

    /**
     * @param  array<int, array{0: string, 1: mixed}>  $pairs
     */
    private function docketInfo(array $pairs): Collection
    {
        return collect($pairs)
            ->filter(fn ($pair) => is_array($pair) && array_key_exists(0, $pair) && array_key_exists(1, $pair))
            ->mapWithKeys(fn ($pair) => [$pair[0] => $pair[1]]);
    }
}
