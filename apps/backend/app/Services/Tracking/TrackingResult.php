<?php

namespace App\Services\Tracking;

class TrackingResult
{
    /**
     * @param  TrackingEventData[]  $events
     * @param  array<string, mixed>|null  $rawResponse
     */
    public function __construct(
        public readonly string $status,
        public readonly ?string $rawStatus,
        public readonly ?string $currentLocation,
        public readonly ?string $estimatedDelivery,
        public readonly array $events,
        public readonly ?string $actualDeliveryDate = null,
        public readonly ?string $senderName = null,
        public readonly ?string $receiverName = null,
        public readonly ?string $originCountry = null,
        public readonly ?string $originCity = null,
        public readonly ?string $destinationCountry = null,
        public readonly ?string $destinationCity = null,
        public readonly ?string $referenceNumber = null,
        public readonly ?string $weightKg = null,
        public readonly ?string $packageDescription = null,
        public readonly ?array $rawResponse = null,
    ) {}
}
