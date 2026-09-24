<?php

namespace Database\Factories;

use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\TrackingEvent>
 */
class TrackingEventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'shipment_id' => Shipment::factory(),
            'status' => fake()->randomElement(Shipment::STATUSES),
            'location' => fake()->city(),
            'description' => fake()->sentence(),
            'event_time' => fake()->dateTimeBetween('-5 days', 'now'),
        ];
    }
}
