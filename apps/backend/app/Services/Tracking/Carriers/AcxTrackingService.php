<?php

namespace App\Services\Tracking\Carriers;

/**
 * ACX International tracking API see AbstractDocketTrackingService for the
 * shared docket/tracking_api response mapping this carrier shares with the
 * other white-label integrations (Patel, SSCF, HiSpeed).
 */
class AcxTrackingService extends AbstractDocketTrackingService
{
    protected function configKey(): string
    {
        return 'acx';
    }

    protected function authErrorLabel(): string
    {
        return 'ACX_API_COMPANY_ID / ACX_CUSTOMER_CODE';
    }
}
