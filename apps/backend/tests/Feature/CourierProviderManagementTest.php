<?php

namespace Tests\Feature;

use App\Models\CourierProvider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourierProviderManagementTest extends TestCase
{
    use RefreshDatabase;

    private function actingAdmin(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        return $user;
    }

    public function test_admin_can_delete_a_provider(): void
    {
        $this->actingAdmin();
        $provider = CourierProvider::factory()->create(['code' => 'TNT']);

        $this->deleteJson("/api/courier-providers/{$provider->id}")->assertOk();
        $this->assertDatabaseMissing('courier_providers', ['id' => $provider->id]);
    }

    public function test_guest_cannot_delete_a_provider(): void
    {
        $provider = CourierProvider::factory()->create();

        $this->deleteJson("/api/courier-providers/{$provider->id}")->assertStatus(401);
        $this->assertDatabaseHas('courier_providers', ['id' => $provider->id]);
    }

    public function test_creating_and_updating_providers_via_the_api_is_no_longer_supported(): void
    {
        $this->actingAdmin();
        $provider = CourierProvider::factory()->create();

        $this->postJson('/api/courier-providers', ['name' => 'Blue Dart', 'code' => 'BLUEDART'])->assertStatus(405);
        $this->putJson("/api/courier-providers/{$provider->id}", ['name' => 'New Name'])->assertStatus(405);
    }
}
