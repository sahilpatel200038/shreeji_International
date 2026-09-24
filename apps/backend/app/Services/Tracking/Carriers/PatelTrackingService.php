<?php

namespace App\Services\Tracking\Carriers;

/**
 * Patel International Courier tracking API see AbstractDocketTrackingService
 * for the shared docket/tracking_api response mapping this carrier shares
 * with the other white-label integrations (ACX, SSCF, HiSpeed).
 */
class PatelTrackingService extends AbstractDocketTrackingService
{
    protected function configKey(): string
    {
        return 'patel';
    }

    protected function authErrorLabel(): string
    {
        return 'PATEL_API_COMPANY_ID / PATEL_CUSTOMER_CODE';
    }
}
