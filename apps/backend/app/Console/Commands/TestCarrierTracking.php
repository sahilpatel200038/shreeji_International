<?php

namespace App\Console\Commands;

use App\Services\Tracking\CarrierTrackingManager;
use App\Services\Tracking\Exceptions\CarrierTrackingException;
use Illuminate\Console\Command;

class TestCarrierTracking extends Command
{
    protected $signature = 'tracking:test-carrier {tracking_number} {code=ACX : ACX or PATEL}';

    protected $description = 'Call a carrier tracking API directly and dump the normalized result, for verifying real API credentials.';

    public function handle(CarrierTrackingManager $manager): int
    {
        $code = strtoupper((string) $this->argument('code'));
        $trackingNumber = (string) $this->argument('tracking_number');

        if (! $manager->supports($code)) {
            $this->error("No integration exists for [{$code}]. Supported: ACX, PATEL.");

            return self::FAILURE;
        }

        try {
            $result = $manager->resolve($code)->track($trackingNumber);
        } catch (CarrierTrackingException $e) {
            $this->error('Carrier call failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info('Status: '.$result->status.' (raw: '.($result->rawStatus ?? '—').')');
        $this->info('Current location: '.($result->currentLocation ?? '—'));
        $this->info('Estimated delivery: '.($result->estimatedDelivery ?? '—'));
        $this->info('Events: '.count($result->events));

        foreach ($result->events as $event) {
            $this->line(sprintf(
                '  [%s] %s %s (%s)',
                $event->eventTime->toDateTimeString(),
                $event->status,
                $event->description ?? '—',
                $event->location ?? '—',
            ));
        }

        return self::SUCCESS;
    }
}
