<?php

namespace App\Services\Tracking;

use App\Services\Tracking\Carriers\AcxTrackingService;
use App\Services\Tracking\Carriers\HiSpeedTrackingService;
use App\Services\Tracking\Carriers\PatelTrackingService;
use App\Services\Tracking\Carriers\SscfTrackingService;
use App\Services\Tracking\Exceptions\UnsupportedCarrierException;
use Illuminate\Contracts\Container\Container;

class CarrierTrackingManager
{
    /**
     * Supported tracking sources. Each shipment's courier_provider.code
     * determines which of these is used to sync it.
     *
     * @var array<string, class-string<CarrierTrackingService>>
     */
    private const SERVICE_MAP = [
        'ACX' => AcxTrackingService::class,
        'PATEL' => PatelTrackingService::class,
        'SSCF' => SscfTrackingService::class,
        'HISPEED' => HiSpeedTrackingService::class,
    ];

    public function __construct(private readonly Container $container) {}

    public function supports(string $carrierCode): bool
    {
        return isset(self::SERVICE_MAP[strtoupper($carrierCode)]);
    }

    public function resolve(string $carrierCode): CarrierTrackingService
    {
        $code = strtoupper($carrierCode);

        if (! isset(self::SERVICE_MAP[$code])) {
            throw new UnsupportedCarrierException("No carrier tracking integration exists for [{$carrierCode}].");
        }

        return $this->container->make(self::SERVICE_MAP[$code]);
    }
}
