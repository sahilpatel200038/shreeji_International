<?php

namespace Database\Factories;

use App\Models\CourierProvider;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shipment>
 */
class ShipmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tracking_number' => strtoupper('SIC'.fake()->unique()->numerify('##########')),
            'reference_number' => fake()->optional()->bothify('REF-####??'),
            'courier_provider_id' => CourierProvider::factory(),

            'sender_name' => fake()->name(),
            'sender_phone' => fake()->phoneNumber(),
            'sender_email' => fake()->safeEmail(),
            'sender_address' => fake()->address(),

            'receiver_name' => fake()->name(),
            'receiver_phone' => fake()->phoneNumber(),
            'receiver_email' => fake()->safeEmail(),
            'receiver_address' => fake()->address(),

            'origin_country' => 'India',
            'origin_city' => 'Ahmedabad',
            'destination_country' => fake()->randomElement(['USA', 'UK', 'Canada', 'Australia', 'UAE']),
            'destination_city' => fake()->city(),

            'shipment_type' => fake()->randomElement(['document', 'parcel', 'cargo']),
            'package_description' => fake()->sentence(),
            'weight_kg' => fake()->randomFloat(2, 0.5, 25),
            'length_cm' => fake()->randomFloat(2, 10, 60),
            'width_cm' => fake()->randomFloat(2, 10, 60),
            'height_cm' => fake()->randomFloat(2, 10, 60),

            'status' => 'created',
            'current_location' => 'Ahmedabad, India',
            'estimated_delivery_date' => fake()->dateTimeBetween('+3 days', '+10 days'),
        ];
    }
}
