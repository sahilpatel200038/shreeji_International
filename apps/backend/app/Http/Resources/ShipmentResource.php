<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tracking_number' => $this->tracking_number,
            'reference_number' => $this->reference_number,
            'courier_provider' => new CourierProviderResource($this->whenLoaded('courierProvider')),
            'sender' => [
                'name' => $this->sender_name,
                'phone' => $this->sender_phone,
                'email' => $this->sender_email,
                'address' => $this->sender_address,
            ],
            'receiver' => [
                'name' => $this->receiver_name,
                'phone' => $this->receiver_phone,
                'email' => $this->receiver_email,
                'address' => $this->receiver_address,
            ],
            'origin' => [
                'country' => $this->origin_country,
                'city' => $this->origin_city,
            ],
            'destination' => [
                'country' => $this->destination_country,
                'city' => $this->destination_city,
            ],
            'shipment_type' => $this->shipment_type,
            'package_description' => $this->package_description,
            'weight_kg' => $this->weight_kg,
            'dimensions_cm' => [
                'length' => $this->length_cm,
                'width' => $this->width_cm,
                'height' => $this->height_cm,
            ],
            'status' => $this->status,
            'status_label' => str($this->status)->replace('_', ' ')->title()->toString(),
            'current_location' => $this->current_location,
            'estimated_delivery_date' => $this->estimated_delivery_date?->toDateString(),
            'actual_delivery_date' => $this->actual_delivery_date?->toIso8601String(),
            'carrier_raw_status' => $this->carrier_raw_status,
            'carrier_raw_response' => $this->carrier_raw_response,
            'last_synced_at' => $this->last_synced_at?->toIso8601String(),
            'last_sync_error' => $this->last_sync_error,
            'tracking_events' => TrackingEventResource::collection($this->whenLoaded('trackingEvents')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
