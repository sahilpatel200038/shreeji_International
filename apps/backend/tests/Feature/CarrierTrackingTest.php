<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Models\TrackingEvent;
use App\Models\User;
use App\Services\ShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CarrierTrackingTest extends TestCase
{
    use RefreshDatabase;

    private function configureAcx(): void
    {
        config(['services.acx.company_id' => '9', 'services.acx.customer_code' => 'A0426']);
    }

    private function acxShipment(): Shipment
    {
        $provider = CourierProvider::factory()->create(['code' => 'ACX', 'name' => 'ACX International']);

        return Shipment::factory()->create([
            'tracking_number' => '8040415',
            'courier_provider_id' => $provider->id,
            'status' => 'created',
        ]);
    }

    private function fakeAcxResponse(array $overrides = []): array
    {
        return array_merge([
            'errors' => false,
            'tracking_no' => '8040415',
            'chargeable_weight' => '29.00',
            'forwarding_no' => '1550 3215 4632 579',
            'expected_datetime' => null,
            'item_data' => '',
            'docket_info' => [
                ['AWB No.', '8040415'],
                ['Status', 'DELIVERED'],
                ['Origin', 'INDIA'],
                ['Destination', 'United Kingdom'],
                ['Delivery Date and Time', '2026-09-17 10:14:00'],
                ['Shipper Name', 'PATEL RITESHBHAI'],
                ['Consignee Name', 'KETAN PATEL'],
                ['Shipper City', 'AHMEDABAD'],
                ['Consignee City', 'HARROW'],
            ],
            'docket_events' => [
                [
                    'id' => '4506089',
                    'event_at' => '2026-09-17 10:14:00',
                    'event_type' => 'API',
                    'event_description' => 'Delivered',
                    'event_location' => 'Radlett - UNITED KINGDOM',
                    'event_state' => 'delivered',
                ],
                [
                    'id' => '4420764',
                    'event_at' => '2026-09-10 18:22:10',
                    'event_type' => 'SYSTEM',
                    'event_description' => 'SHIPMENT HAS BEEN BOOKED',
                    'event_location' => 'AHMEDABAD',
                    'event_state' => 'entry',
                ],
            ],
        ], $overrides);
    }

    public function test_acx_sync_maps_status_and_events(): void
    {
        $this->configureAcx();

        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse()], 200),
        ]);

        $shipment = $this->acxShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $shipment = $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertSame('delivered', $shipment->status);
        $this->assertNull($shipment->last_sync_error);
        $this->assertNotNull($shipment->last_synced_at);
        $this->assertSame(2, $shipment->trackingEvents()->where('source', 'carrier')->count());
        $this->assertNotNull($shipment->carrier_raw_response);
    }

    public function test_manual_events_survive_a_carrier_sync(): void
    {
        $this->configureAcx();

        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse(['docket_events' => []])], 200),
        ]);

        $shipment = $this->acxShipment();
        TrackingEvent::factory()->create([
            'shipment_id' => $shipment->id,
            'status' => 'created',
            'source' => 'manual',
            'description' => 'Booked in by staff',
        ]);

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertSame(1, $shipment->trackingEvents()->where('source', 'manual')->count());
    }

    public function test_missing_credentials_records_sync_error_without_crashing(): void
    {
        config(['services.acx.company_id' => null, 'services.acx.customer_code' => null]);

        $shipment = $this->acxShipment();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $shipment = $service->syncTrackingFromCarrier($shipment, force: true);

        $this->assertNotNull($shipment->last_sync_error);
        $this->assertSame('created', $shipment->status);
    }

    public function test_sync_is_skipped_within_cache_ttl(): void
    {
        $this->configureAcx();
        Http::fake(['*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse()], 200)]);

        $shipment = $this->acxShipment();
        $shipment->last_synced_at = now();
        $shipment->save();

        /** @var ShipmentService $service */
        $service = app(ShipmentService::class);
        $service->syncTrackingFromCarrier($shipment);

        Http::assertNothingSent();
    }

    public function test_public_tracking_endpoint_creates_shipment_on_first_lookup(): void
    {
        $this->configureAcx();
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse()], 200),
        ]);

        $response = $this->getJson('/api/tracking/8040415');

        $response->assertOk()
            ->assertJsonPath('data.tracking_number', '8040415')
            ->assertJsonPath('data.status', 'delivered')
            ->assertJsonPath('data.courier_provider.code', 'ACX')
            ->assertJsonCount(2, 'data.tracking_events');

        $this->assertSame(1, Shipment::where('tracking_number', '8040415')->count());
    }

    public function test_repeated_search_updates_the_same_record_instead_of_duplicating(): void
    {
        $this->configureAcx();
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse()], 200),
        ]);

        $this->getJson('/api/tracking/8040415')->assertOk();
        $this->getJson('/api/tracking/8040415')->assertOk();

        $this->assertSame(1, Shipment::where('tracking_number', '8040415')->count());
    }

    public function test_tracking_lookup_for_unknown_number_returns_404(): void
    {
        $this->configureAcx();
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([['errors' => true]], 200),
        ]);

        $response = $this->getJson('/api/tracking/DOES-NOT-EXIST');

        $response->assertStatus(404)->assertJsonPath('success', false);
    }

    public function test_carrier_outage_on_first_lookup_returns_friendly_error(): void
    {
        $this->configureAcx();
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/tracking/8040415');

        $response->assertStatus(503)->assertJsonPath('success', false);
        $response->assertJsonMissingPath('data.message');
    }

    public function test_admin_can_force_sync_via_endpoint(): void
    {
        $this->configureAcx();
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([$this->fakeAcxResponse()], 200),
        ]);

        $shipment = $this->acxShipment();
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/shipments/{$shipment->id}/sync-tracking");

        $response->assertOk()->assertJsonPath('data.status', 'delivered');
    }
}
