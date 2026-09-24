<?php

namespace App\Services\Tracking;

interface CarrierTrackingService
{
    public function track(string $trackingNumber): TrackingResult;
}
