<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShipmentResource;
use App\Http\Resources\TrackingEventResource;
use App\Http\Responses\ApiResponse;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function __construct(private readonly ShipmentService $shipmentService) {}

    public function index(Request $request): JsonResponse
    {
        $query = Shipment::with('courierProvider')->latest();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('sender_name', 'like', "%{$search}%")
                    ->orWhere('receiver_name', 'like', "%{$search}%")
                    ->orWhere('receiver_phone', 'like', "%{$search}%")
                    ->orWhere('reference_number', 'like', "%{$search}%")
                    ->orWhereHas('courierProvider', fn ($cp) => $cp->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($provider = $request->query('courier_provider_id')) {
            $query->where('courier_provider_id', $provider);
        }

        $shipments = $query->paginate((int) $request->query('per_page', 15));

        return ApiResponse::success([
            'items' => ShipmentResource::collection($shipments->items()),
            'meta' => [
                'current_page' => $shipments->currentPage(),
                'last_page' => $shipments->lastPage(),
                'per_page' => $shipments->perPage(),
                'total' => $shipments->total(),
            ],
        ], 'Shipments retrieved successfully');
    }

    public function show(Shipment $shipment): JsonResponse
    {
        $shipment->load(['courierProvider', 'trackingEvents']);

        return ApiResponse::success(new ShipmentResource($shipment), 'Shipment retrieved successfully');
    }

    public function destroy(Shipment $shipment): JsonResponse
    {
        $shipment->delete();

        return ApiResponse::success(null, 'Shipment deleted successfully');
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:shipments,id'],
        ]);

        $deleted = Shipment::whereIn('id', $validated['ids'])->delete();

        return ApiResponse::success(['deleted' => $deleted], "{$deleted} shipment(s) deleted successfully");
    }

    public function trackingEvents(Shipment $shipment): JsonResponse
    {
        $shipment->load('trackingEvents');

        return ApiResponse::success(
            TrackingEventResource::collection($shipment->trackingEvents),
            'Tracking history retrieved successfully'
        );
    }

    public function syncTracking(Shipment $shipment): JsonResponse
    {
        $shipment->load('courierProvider');
        $shipment = $this->shipmentService->syncTrackingFromCarrier($shipment, force: true);
        $shipment->load(['courierProvider', 'trackingEvents']);

        return ApiResponse::success(new ShipmentResource($shipment), 'Tracking synced from carrier');
    }
}
