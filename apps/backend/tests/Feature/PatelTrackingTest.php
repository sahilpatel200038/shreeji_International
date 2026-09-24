<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PatelTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Never let a test hit the real ACX API; default to "not configured"
        // so the ACX-first lookup fails fast and falls through to Patel.
        config(['services.acx.company_id' => null, 'services.acx.customer_code' => null]);
    }

    private function configurePatel(): void
    {
        config(['services.patel.company_id' => '17', 'services.patel.customer_code' => 'p029']);
    }

    private function patelShipment(): Shipment
    {
        $provider = CourierProvider::factory()->create(['code' => 'PATEL', 'name' => 'Patel International Courier']);

        return Shipment::factory()->create([
            'tracking_number' => '7005231',
            'courier_provider_id' => $provider->id,
            'status' => 'created',
        ]);
    }

    /**
     * Real API response shape for tracking number 7005231, trimmed to the
     * fields the mapper reads (see Downloads/Json Parsers Online.html).
     */
    private function fakePatelResponse(array $overrides = []): array
    {
        return array_merge([
            'errors' => false,
            'tracking_no' => '7005231',
            'chargeable_weight' => '2.00',
            'forwarding_no' => '877559761216',
            'reference_no' => '',
            'pcs' => '1',
            'item_data' => '',
            'expected_datetime' => '2026-09-29 00:00',
            'docket_info' => [
                ['AWB No.', '7005231'],
                ['Booking Date', '2026-09-21'],
                ['Consignee Name', 'KINJAL PATEL'],
                ['Destination', 'UNITED STATES OF AMERICA'],
                ['Status', 'INTRANSIT'],
                ['Delivery Date and Time', ''],
                ['Receiver Name', ''],
                ['Forwarding No.', '877559761216'],
                ['Origin', 'INDIA'],
                ['Origin_city', ''],
                ['Destinantion_city', ''],
                ['Consignee Company', 'KINJAL PATEL'],
                ['Shipper Company', 'GITABEN HIRPARA'],
                ['Service Name', 'FEDEX IP G'],
                ['Shipper Name', 'GITABEN HIRPARA'],
                ['Shipper City', 'AHMEDABAD'],
                ['Shipper State', 'GJ'],
                ['Shipper Country', 'INDIA'],
                ['Consignee City', 'WESLEY CHAPEL'],
                ['Consignee State', 'FL'],
                ['Consignee Country', 'UNITED STATES OF AMERICA'],
                ['Origin Hub', 'Ahmedabad'],
            ],
            'docket_events' => [
                [
                    'id' => '26443',
                    'event_at' => '2026-09-23 16:46:00',
                    'event_type' => 'API',
                    'event_description' => 'Left FedEx origin facility',
                    'event_location' => 'AHMEDABAD,GJ',
                    'event_state' => 'in_transit',
                    'event_remark' => '',
                ],
                [
                    'id' => '26445',
                    'event_at' => '2026-09-23 13:30:00',
                    'event_type' => 'API',
                    'event_description' => 'Picked up',
                    'event_location' => 'AHMEDABAD,GJ',
                    'event_state' => 'in_transit',
                    'event_remark' => '',
                ],
                [
                    'id' => '26218',
                    'event_at' => '2026-09-22 05:30:57',
                    'event_type' => 'API',
                    'event_description' => 'Shipment information sent to FedEx',
                    'event_location' => '',
                    'event_state' => 'entry',
                    'event_remark' => '',
                ],
                [
                    'id' => '25887',
                    'event_at' => '2026-09-21 10:53:00',
                    'event_type' => 'SYSTEM',
                    'event_description' => 'SHIPMENT HAS BEEN BOOKED',
                    'event_location' => 'AHMEDABAD',
                    'event_state' => 'entry',
                    'event_remark' => '',
                ],
            ],
        ], $overrides);
    }

    public function test_patel_sync_maps_status_and_events(): void
    {
        $this->configurePatel();

        Http::fake([
            'admin.patelcouriers.in/*' => Http::response([$this->fakePatelResponse()], 200),
        ]);

        $shipment = $this->patelShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $shipment = $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertSame('in_transit', $shipment->status);
        $this->assertNull($shipment->last_sync_error);
        $this->assertSame(4, $shipment->trackingEvents()->where('source', 'carrier')->count());
        $this->assertNotNull($shipment->carrier_raw_response);
    }

    public function test_patel_sync_does_not_call_acx(): void
    {
        $this->configurePatel();

        Http::fake([
            'admin.patelcouriers.in/*' => Http::response([$this->fakePatelResponse()], 200),
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
        ]);

        $shipment = $this->patelShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $service->syncTrackingFromCarrier($shipment, force: true);

        Http::assertNotSent(fn ($request) => str_contains($request->url(), 'acxintl.in'));
    }

    public function test_public_tracking_falls_back_to_patel_when_acx_does_not_recognise_the_number(): void
    {
        $this->configurePatel();

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([$this->fakePatelResponse()], 200),
        ]);

        $response = $this->getJson('/api/tracking/7005231');

        $response->assertOk()
            ->assertJsonPath('data.tracking_number', '7005231')
            ->assertJsonPath('data.status', 'in_transit')
            ->assertJsonPath('data.courier_provider.code', 'PATEL')
            ->assertJsonCount(4, 'data.tracking_events');

        $this->assertSame(1, Shipment::where('tracking_number', '7005231')->count());
    }

    public function test_repeated_patel_search_updates_the_same_record_instead_of_duplicating(): void
    {
        $this->configurePatel();

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([$this->fakePatelResponse()], 200),
        ]);

        $this->getJson('/api/tracking/7005231')->assertOk();
        $this->getJson('/api/tracking/7005231')->assertOk();

        $this->assertSame(1, Shipment::where('tracking_number', '7005231')->count());
    }

    public function test_unknown_number_on_all_configured_carriers_still_returns_404(): void
    {
        $this->configurePatel();

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([['errors' => true]], 200),
            'admin.sscf.online/*' => Http::response([['errors' => true]], 200),
            'admin.hispeedinternationalcourier.com/*' => Http::response([['errors' => true]], 200),
        ]);

        $response = $this->getJson('/api/tracking/DOES-NOT-EXIST');

        $response->assertStatus(404)->assertJsonPath('success', false);
    }
}
