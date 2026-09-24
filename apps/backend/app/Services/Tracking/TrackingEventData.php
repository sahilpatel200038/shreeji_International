<?php

namespace App\Services\Tracking;

use Illuminate\Support\Carbon;

class TrackingEventData
{
    public function __construct(
        public readonly string $status,
        public readonly ?string $location,
        public readonly ?string $description,
        public readonly Carbon $eventTime,
    ) {}
}
