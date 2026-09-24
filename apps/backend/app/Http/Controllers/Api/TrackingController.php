<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShipmentResource;
use App\Http\Responses\ApiResponse;
use App\Services\ShipmentService;
use App\Services\Tracking\Exceptions\CarrierNotFoundException;
use App\Services\Tracking\Exceptions\CarrierTrackingException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TrackingController extends Controller
{
    public function __construct(private readonly ShipmentService $shipmentService) {}

    public function show(string $trackingNumber): JsonResponse
    {
        $trackingNumber = trim($trackingNumber);

        if ($trackingNumber === '' || strlen($trackingNumber) > 32) {
            throw ValidationException::withMessages([
                'tracking_number' => ['Please enter a valid tracking number.'],
            ]);
        }

        try {
            $shipment = $this->shipmentService->trackByNumber($trackingNumber);
        } catch (CarrierNotFoundException) {
            return ApiResponse::error('No shipment found for this tracking number.', 404);
        } catch (CarrierTrackingException $e) {
            report($e);

            return ApiResponse::error('We could not retrieve tracking information right now. Please try again shortly.', 503);
        }

        return ApiResponse::success(new ShipmentResource($shipment), 'Shipment tracking retrieved successfully');
    }
}
