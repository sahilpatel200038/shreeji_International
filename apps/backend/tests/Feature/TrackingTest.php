<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\Shipment;
use App\Models\TrackingEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Never let a test hit the real ACX API; default to "not configured"
        // so syncTrackingFromCarrier no-ops (records last_sync_error) unless
        // a test explicitly fakes a response.
        config(['services.acx.company_id' => null, 'services.acx.customer_code' => null]);
    }

    public function test_public_tracking_lookup_returns_shipment_with_history(): void
    {
        $provider = CourierProvider::factory()->create();
        $shipment = Shipment::factory()->create([
            'tracking_number' => 'SIC1234567890',
            'courier_provider_id' => $provider->id,
            'status' => 'in_transit',
        ]);
        TrackingEvent::factory()->create([
            'shipment_id' => $shipment->id,
            'status' => 'in_transit',
        ]);

        $response = $this->getJson('/api/tracking/SIC1234567890');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.tracking_number', 'SIC1234567890')
            ->assertJsonCount(1, 'data.tracking_events');
    }

    public function test_tracking_lookup_for_unknown_number_returns_404(): void
    {
        config(['services.acx.company_id' => '9', 'services.acx.customer_code' => 'A0426']);
        Http::fake([
            '*/api/tracking_api/get_tracking_data*' => Http::response([['errors' => true]], 200),
        ]);

        $response = $this->getJson('/api/tracking/DOES-NOT-EXIST');

        $response->assertStatus(404)
            ->assertJsonPath('success', false);
    }

    public function test_courier_providers_list_only_returns_active_by_default(): void
    {
        CourierProvider::factory()->create(['is_active' => true]);
        CourierProvider::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/courier-providers');

        $response->assertOk()->assertJsonCount(1, 'data');
    }
}
