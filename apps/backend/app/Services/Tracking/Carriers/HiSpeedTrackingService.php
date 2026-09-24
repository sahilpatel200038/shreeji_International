<?php

namespace App\Services\Tracking\Carriers;

/**
 * HiSpeed International Courier tracking API see AbstractDocketTrackingService
 * for the shared docket/tracking_api response mapping this carrier shares
 * with the other white-label integrations (ACX, Patel, SSCF).
 */
class HiSpeedTrackingService extends AbstractDocketTrackingService
{
    protected function configKey(): string
    {
        return 'hispeed';
    }

    protected function authErrorLabel(): string
    {
        return 'HISPEED_API_COMPANY_ID / HISPEED_CUSTOMER_CODE';
    }
}
