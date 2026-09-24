<?php

namespace Tests\Feature;

use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShipmentManagementTest extends TestCase
{
    use RefreshDatabase;

    private function actingAdmin(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        return $user;
    }

    public function test_guest_cannot_access_shipment_management(): void
    {
        $shipment = Shipment::factory()->create();

        $this->getJson('/api/shipments')->assertStatus(401);
        $this->deleteJson("/api/shipments/{$shipment->id}")->assertStatus(401);
    }

    public function test_admin_can_add_a_tracking_event_which_updates_shipment_status(): void
    {
        $this->actingAdmin();
        $shipment = Shipment::factory()->create(['status' => 'created']);

        $response = $this->postJson("/api/shipments/{$shipment->id}/tracking-events", [
            'status' => 'out_for_delivery',
            'location' => 'Ahmedabad, India',
        ]);

        $response->assertStatus(201)->assertJsonPath('data.status', 'out_for_delivery');
        $this->assertDatabaseHas('shipments', ['id' => $shipment->id, 'status' => 'out_for_delivery']);
    }

    public function test_adding_a_tracking_event_with_an_invalid_status_fails_validation(): void
    {
        $this->actingAdmin();
        $shipment = Shipment::factory()->create();

        $response = $this->postJson("/api/shipments/{$shipment->id}/tracking-events", [
            'status' => 'not_a_real_status',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('status');
    }

    public function test_adding_a_tracking_event_to_a_missing_shipment_returns_404(): void
    {
        $this->actingAdmin();

        $response = $this->postJson('/api/shipments/999999/tracking-events', ['status' => 'in_transit']);

        $response->assertStatus(404);
    }

    public function test_admin_can_delete_a_shipment(): void
    {
        $this->actingAdmin();
        $shipment = Shipment::factory()->create();

        $this->deleteJson("/api/shipments/{$shipment->id}")->assertOk();
        $this->assertDatabaseMissing('shipments', ['id' => $shipment->id]);
    }

    public function test_creating_and_updating_shipments_via_the_api_is_no_longer_supported(): void
    {
        $this->actingAdmin();
        $shipment = Shipment::factory()->create();

        $this->postJson('/api/shipments', ['tracking_number' => 'X'])->assertStatus(405);
        $this->putJson("/api/shipments/{$shipment->id}", ['current_location' => 'Mumbai Hub'])->assertStatus(405);
    }

    public function test_admin_can_search_and_filter_shipments(): void
    {
        $this->actingAdmin();
        Shipment::factory()->create(['tracking_number' => 'FINDME123', 'status' => 'delivered']);
        Shipment::factory()->create(['tracking_number' => 'OTHER456', 'status' => 'in_transit']);

        $response = $this->getJson('/api/shipments?search=FINDME');

        $response->assertOk()->assertJsonCount(1, 'data.items');
    }

    public function test_admin_can_search_shipments_by_courier_company_name(): void
    {
        $this->actingAdmin();
        $sscf = \App\Models\CourierProvider::factory()->create(['name' => 'SSCF']);
        $other = \App\Models\CourierProvider::factory()->create(['name' => 'ACX International']);
        Shipment::factory()->create(['courier_provider_id' => $sscf->id]);
        Shipment::factory()->create(['courier_provider_id' => $other->id]);

        $response = $this->getJson('/api/shipments?search=SSCF');

        $response->assertOk()->assertJsonCount(1, 'data.items');
    }

    public function test_admin_can_search_shipments_by_customer_number(): void
    {
        $this->actingAdmin();
        Shipment::factory()->create(['receiver_phone' => '9998887770']);
        Shipment::factory()->create(['receiver_phone' => '1112223330']);

        $response = $this->getJson('/api/shipments?search=9998887770');

        $response->assertOk()->assertJsonCount(1, 'data.items');
    }

    public function test_admin_can_bulk_delete_selected_shipments_only(): void
    {
        $this->actingAdmin();
        $a = Shipment::factory()->create();
        $b = Shipment::factory()->create();
        $keep = Shipment::factory()->create();

        $response = $this->postJson('/api/shipments/bulk-delete', ['ids' => [$a->id, $b->id]]);

        $response->assertOk()->assertJsonPath('data.deleted', 2);
        $this->assertDatabaseMissing('shipments', ['id' => $a->id]);
        $this->assertDatabaseMissing('shipments', ['id' => $b->id]);
        $this->assertDatabaseHas('shipments', ['id' => $keep->id]);
    }

    public function test_bulk_delete_requires_valid_ids(): void
    {
        $this->actingAdmin();

        $this->postJson('/api/shipments/bulk-delete', ['ids' => [999999]])
            ->assertStatus(422)
            ->assertJsonValidationErrors('ids.0');

        $this->postJson('/api/shipments/bulk-delete', ['ids' => []])
            ->assertStatus(422)
            ->assertJsonValidationErrors('ids');
    }

    public function test_guest_cannot_bulk_delete_shipments(): void
    {
        $shipment = Shipment::factory()->create();

        $this->postJson('/api/shipments/bulk-delete', ['ids' => [$shipment->id]])->assertStatus(401);
        $this->assertDatabaseHas('shipments', ['id' => $shipment->id]);
    }
}
