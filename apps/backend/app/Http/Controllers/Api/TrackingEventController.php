<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTrackingEventRequest;
use App\Http\Resources\TrackingEventResource;
use App\Http\Responses\ApiResponse;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Http\JsonResponse;

class TrackingEventController extends Controller
{
    public function __construct(private readonly ShipmentService $shipmentService)
    {
    }

    public function store(StoreTrackingEventRequest $request, Shipment $shipment): JsonResponse
    {
        $event = $this->shipmentService->recordEvent($shipment, $request->validated());

        return ApiResponse::success(new TrackingEventResource($event), 'Tracking event added successfully', 201);
    }
}
