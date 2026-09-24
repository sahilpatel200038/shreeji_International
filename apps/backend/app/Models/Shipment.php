<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    use HasFactory;

    public const STATUSES = [
        'created',
        'picked_up',
        'at_origin_facility',
        'departed_origin',
        'in_transit',
        'arrived_destination_country',
        'customs_clearance',
        'customs_cleared',
        'out_for_delivery',
        'delivered',
        'delivery_attempted',
        'exception',
        'returned',
        'cancelled',
    ];

    protected $fillable = [
        'tracking_number',
        'reference_number',
        'courier_provider_id',
        'sender_name',
        'sender_phone',
        'sender_email',
        'sender_address',
        'receiver_name',
        'receiver_phone',
        'receiver_email',
        'receiver_address',
        'origin_country',
        'origin_city',
        'destination_country',
        'destination_city',
        'shipment_type',
        'package_description',
        'weight_kg',
        'length_cm',
        'width_cm',
        'height_cm',
        'status',
        'current_location',
        'estimated_delivery_date',
        'actual_delivery_date',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'decimal:2',
            'length_cm' => 'decimal:2',
            'width_cm' => 'decimal:2',
            'height_cm' => 'decimal:2',
            'estimated_delivery_date' => 'date',
            'actual_delivery_date' => 'datetime',
            'last_synced_at' => 'datetime',
            'carrier_raw_response' => 'array',
        ];
    }

    public function courierProvider(): BelongsTo
    {
        return $this->belongsTo(CourierProvider::class);
    }

    public function trackingEvents(): HasMany
    {
        return $this->hasMany(TrackingEvent::class)->orderByDesc('event_time');
    }
}
