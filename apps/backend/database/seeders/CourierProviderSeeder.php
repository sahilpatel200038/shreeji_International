<?php

namespace Database\Seeders;

use App\Models\CourierProvider;
use Illuminate\Database\Seeder;

class CourierProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            ['name' => 'ACX International', 'code' => 'ACX', 'tracking_url_template' => null],
            ['name' => 'DHL Express', 'code' => 'DHL', 'tracking_url_template' => 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_number}'],
            ['name' => 'FedEx', 'code' => 'FEDEX', 'tracking_url_template' => 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}'],
            ['name' => 'UPS', 'code' => 'UPS', 'tracking_url_template' => 'https://www.ups.com/track?tracknum={tracking_number}'],
            ['name' => 'Aramex', 'code' => 'ARAMEX', 'tracking_url_template' => 'https://www.aramex.com/track/results?ShipmentNumber={tracking_number}'],
            ['name' => 'USPS', 'code' => 'USPS', 'tracking_url_template' => 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking_number}'],
            ['name' => 'Royal Mail', 'code' => 'ROYALMAIL', 'tracking_url_template' => 'https://www.royalmail.com/track-your-item#/tracking-results/{tracking_number}'],
            ['name' => 'TNT', 'code' => 'TNT', 'tracking_url_template' => 'https://www.tnt.com/express/en_in/site/shipping-tools/tracking.html?searchType=CON&cons={tracking_number}'],
        ];

        foreach ($providers as $provider) {
            CourierProvider::updateOrCreate(['code' => $provider['code']], $provider);
        }
    }
}
