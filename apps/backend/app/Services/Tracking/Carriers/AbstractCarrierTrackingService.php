<?php

namespace App\Services\Tracking\Carriers;

use App\Services\Tracking\CarrierTrackingService;
use App\Services\Tracking\Exceptions\CarrierApiException;
use App\Services\Tracking\Exceptions\CarrierNotFoundException;
use App\Services\Tracking\Exceptions\CarrierRateLimitException;
use App\Services\Tracking\Exceptions\CarrierTimeoutException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;

abstract class AbstractCarrierTrackingService implements CarrierTrackingService
{
    /**
     * Map a carrier's raw status vocabulary to one of Shipment::STATUSES.
     * Falls back to 'in_transit' when nothing matches.
     *
     * @param  array<string, string>  $map  raw carrier code/keyword => internal status
     */
    protected function mapStatus(array $map, ?string $raw): string
    {
        if ($raw === null) {
            return 'in_transit';
        }

        $needle = strtolower($raw);

        foreach ($map as $carrierKeyword => $internalStatus) {
            if (str_contains($needle, strtolower($carrierKeyword))) {
                return $internalStatus;
            }
        }

        return 'in_transit';
    }

    /**
     * Wrap a network call so connection failures become a typed exception.
     */
    protected function guardTimeout(callable $call): Response
    {
        try {
            return $call();
        } catch (ConnectionException $e) {
            throw new CarrierTimeoutException('The carrier tracking service timed out.', previous: $e);
        }
    }

    /**
     * Throw a typed exception for common non-2xx statuses. No-op on success.
     */
    protected function assertSuccessful(Response $response, string $notFoundMessage): void
    {
        if ($response->successful()) {
            return;
        }

        if ($response->status() === 404) {
            throw new CarrierNotFoundException($notFoundMessage);
        }

        if ($response->status() === 429) {
            throw new CarrierRateLimitException('The carrier tracking service is rate-limiting requests.');
        }

        if ($response->status() === 401 || $response->status() === 403) {
            throw new CarrierApiException('The carrier tracking service rejected our credentials.');
        }

        throw new CarrierApiException('The carrier tracking service returned an unexpected error.');
    }
}
