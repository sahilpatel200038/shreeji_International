<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SscfTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Never let a test hit the real ACX/Patel APIs; default to "not
        // configured" so the ACX/Patel-first lookup fails fast and falls
        // through to SSCF.
        config(['services.acx.company_id' => null, 'services.acx.customer_code' => null]);
        config(['services.patel.company_id' => null, 'services.patel.customer_code' => null]);
    }

    private function configureSscf(): void
    {
        config(['services.sscf.company_id' => '4', 'services.sscf.customer_code' => '046']);
    }

    private function sscfShipment(): Shipment
    {
        $provider = CourierProvider::factory()->create(['code' => 'SSCF', 'name' => 'SSCF']);

        return Shipment::factory()->create([
            'tracking_number' => 'SSCF12345',
            'courier_provider_id' => $provider->id,
            'status' => 'created',
        ]);
    }

    private function fakeSscfResponse(array $overrides = []): array
    {
        return array_merge([
            'errors' => false,
            'tracking_no' => 'SSCF12345',
            'chargeable_weight' => '1.50',
            'forwarding_no' => '900012345',
            'item_data' => '',
            'expected_datetime' => '2026-10-01 00:00',
            'docket_info' => [
                ['Status', 'OUT FOR DELIVERY'],
                ['Origin', 'INDIA'],
                ['Destination', 'CANADA'],
                ['Shipper Name', 'RAVI SHAH'],
                ['Consignee Name', 'JOHN DOE'],
                ['Shipper City', 'SURAT'],
                ['Consignee City', 'TORONTO'],
            ],
            'docket_events' => [
                [
                    'event_at' => '2026-09-30 09:00:00',
                    'event_description' => 'Out for delivery',
                    'event_location' => 'TORONTO',
                ],
                [
                    'event_at' => '2026-09-28 07:00:00',
                    'event_description' => 'SHIPMENT HAS BEEN BOOKED',
                    'event_location' => 'SURAT',
                ],
            ],
        ], $overrides);
    }

    public function test_sscf_sync_maps_status_and_events(): void
    {
        $this->configureSscf();

        Http::fake([
            'admin.sscf.online/*' => Http::response([$this->fakeSscfResponse()], 200),
        ]);

        $shipment = $this->sscfShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $shipment = $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertSame('out_for_delivery', $shipment->status);
        $this->assertNull($shipment->last_sync_error);
        $this->assertSame(2, $shipment->trackingEvents()->where('source', 'carrier')->count());
    }

    public function test_public_tracking_falls_back_to_sscf_when_acx_and_patel_do_not_recognise_the_number(): void
    {
        $this->configureSscf();

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([['errors' => true]], 200),
            'admin.sscf.online/*' => Http::response([$this->fakeSscfResponse()], 200),
        ]);

        $response = $this->getJson('/api/tracking/SSCF12345');

        $response->assertOk()
            ->assertJsonPath('data.tracking_number', 'SSCF12345')
            ->assertJsonPath('data.status', 'out_for_delivery')
            ->assertJsonPath('data.courier_provider.code', 'SSCF')
            ->assertJsonCount(2, 'data.tracking_events');

        $this->assertSame(1, Shipment::where('tracking_number', 'SSCF12345')->count());
    }

    public function test_sscf_success_does_not_call_hispeed(): void
    {
        $this->configureSscf();
        config(['services.hispeed.company_id' => '6', 'services.hispeed.customer_code' => 'T001']);

        Http::fake([
            'admin.acxintl.in/*' => Http::response([['errors' => true]], 200),
            'admin.patelcouriers.in/*' => Http::response([['errors' => true]], 200),
            'admin.sscf.online/*' => Http::response([$this->fakeSscfResponse()], 200),
            'admin.hispeedinternationalcourier.com/*' => Http::response([$this->fakeSscfResponse()], 200),
        ]);

        $this->getJson('/api/tracking/SSCF12345')->assertOk();

        Http::assertNotSent(fn ($request) => str_contains($request->url(), 'hispeedinternationalcourier.com'));
    }
}
