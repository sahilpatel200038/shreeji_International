<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'acx' => [
        'base_url' => env('ACX_API_BASE_URL', 'https://admin.acxintl.in'),
        'company_id' => env('ACX_API_COMPANY_ID'),
        'customer_code' => env('ACX_CUSTOMER_CODE'),
    ],

    'patel' => [
        'base_url' => env('PATEL_API_BASE_URL', 'https://admin.patelcouriers.in'),
        'company_id' => env('PATEL_API_COMPANY_ID'),
        'customer_code' => env('PATEL_CUSTOMER_CODE'),
    ],

    'sscf' => [
        // https, not http: the server force-redirects http -> https, and
        // configuring https directly avoids paying for that redirect round
        // trip on every single tracking lookup.
        'base_url' => env('SSCF_API_BASE_URL', 'https://admin.sscf.online'),
        'company_id' => env('SSCF_API_COMPANY_ID'),
        'customer_code' => env('SSCF_CUSTOMER_CODE'),
    ],

    'hispeed' => [
        // See the sscf note above same http -> https redirect avoided.
        'base_url' => env('HISPEED_API_BASE_URL', 'https://admin.hispeedinternationalcourier.com'),
        'company_id' => env('HISPEED_API_COMPANY_ID'),
        'customer_code' => env('HISPEED_CUSTOMER_CODE'),
    ],

    'tracking' => [
        'cache_ttl_minutes' => env('TRACKING_CACHE_TTL_MINUTES', 15),
        'connect_timeout_seconds' => env('TRACKING_CONNECT_TIMEOUT_SECONDS', 5),
        'request_timeout_seconds' => env('TRACKING_REQUEST_TIMEOUT_SECONDS', 8),
    ],

];
