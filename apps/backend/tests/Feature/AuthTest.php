<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@shreejiintl.com',
            'password' => bcrypt('secret1234'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@shreejiintl.com',
            'password' => 'secret1234',
        ]);

        $response->assertOk()->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'admin@shreejiintl.com']);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@shreejiintl.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)->assertJsonPath('success', false);
    }
}
