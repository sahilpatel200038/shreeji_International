<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HiSpeedTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Never let a test hit the real ACX/Patel/SSCF APIs; default to "not
        // configured" so the lookup chain falls through to HiSpeed.
        config(['services.acx.company_id' => null, 'services.acx.customer_code' => null]);
        config(['services.patel.company_id' => null, 'services.patel.customer_code' => null]);
        config(['services.sscf.company_id' => null, 'services.sscf.customer_code' => null]);
    }

    private function configureHiSpeed(): void
    {
        config(['services.hispeed.company_id' => '6', 'services.hispeed.customer_code' => 'T001']);
    }

    private function hiSpeedShipment(): Shipment
    {
        $provider = CourierProvider::factory()->create(['code' => 'HISPEED', 'name' => 'HiSpeed International Courier']);

        return Shipment::factory()->create([
            'tracking_number' => 'HISPD98765',
            'courier_provider_id' => $provider->id,
            'status' => 'created',
        ]);
    }

    private function fakeHiSpeedResponse(array $overrides = []): array
    {
        return array_merge([
            'errors' => false,
            'tracking_no' => 'HISPD98765',
            'chargeable_weight' => '3.20',
            'forwarding_no' => '700098765',
            'item_data' => '',
            'expected_datetime' => '2026-10-05 00:00',
            'docket_info' => [
                ['Status', 'DELIVERED'],
                ['Origin', 'INDIA'],
                ['Destination', 'AUSTRALIA'],
                ['Delivery Date and Time', '2026-10-04 12:00:00'],
                ['Shipper Name', 'ANITA MEHTA'],
                ['Consignee Name', 'JAMES SMITH'],
                ['Shipper City', 'MUMBAI'],
                ['Consignee City', 'SYDNEY'],
            ],
            'docket_events' => [
                [
                    'event_at' => '2026-10-04 12:00:00',
                    'event_description' => 'Delivered',
                    'event_location' => 'SYDNEY',
                ],
                [
                    'event_at' => '2026-10-01 08:00:00',
                    'event_description' => 'SHIPMENT HAS BEEN BOOKED',
                    'event_location' => 'MUMBAI',
                ],
            ],
        ], $overrides);
    }

    public function test_hispeed_sync_maps_status_and_events(): void
    {
        $this->configureHiSpeed();

        Http::fake([
            'admin.hispeedinternationalcourier.com/*' => Http::response([$this->fakeHiSpeedResponse()], 200),
        ]);

        $shipment = $this->hiSpeedShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $shipment = $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertSame('delivered', $shipment->status);
        $this->assertNull($shipment->last_sync_error);
        $this->assertSame(2, $shipment->trackingEvents()->where('source', 'carrier')->count());
    }

    public function test_public_tracking_falls_back_to_hispeed_as_last_resort(): void
    {
        $this->configureHiSpeed();

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([['errors' => true]], 200),
            'admin.sscf.online/*' => Http::response([['errors' => true]], 200),
            'admin.hispeedinternationalcourier.com/*' => Http::response([$this->fakeHiSpeedResponse()], 200),
        ]);

        $response = $this->getJson('/api/tracking/HISPD98765');

        $response->assertOk()
            ->assertJsonPath('data.tracking_number', 'HISPD98765')
            ->assertJsonPath('data.status', 'delivered')
            ->assertJsonPath('data.courier_provider.code', 'HISPEED')
            ->assertJsonCount(2, 'data.tracking_events');

        $this->assertSame(1, Shipment::where('tracking_number', 'HISPD98765')->count());
    }

    public function test_unknown_number_on_all_four_carriers_returns_404(): void
    {
        $this->configureHiSpeed();

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
