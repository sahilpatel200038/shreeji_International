<?php

namespace App\Services\Tracking\Carriers;

/**
 * SSCF tracking API see AbstractDocketTrackingService for the shared
 * docket/tracking_api response mapping this carrier shares with the other
 * white-label integrations (ACX, Patel, HiSpeed).
 */
class SscfTrackingService extends AbstractDocketTrackingService
{
    protected function configKey(): string
    {
        return 'sscf';
    }

    protected function authErrorLabel(): string
    {
        return 'SSCF_API_COMPANY_ID / SSCF_CUSTOMER_CODE';
    }
}
