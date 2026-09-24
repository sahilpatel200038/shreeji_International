<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourierProviderController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\TrackingEventController;
use Illuminate\Support\Facades\Route;

// Public tracking endpoints
Route::get('/tracking/{trackingNumber}', [TrackingController::class, 'show'])->middleware('throttle:30,1');
Route::get('/courier-providers', [CourierProviderController::class, 'index']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Admin shipment management (shipments are only ever created via the public
    // carrier tracking lookup; the admin panel is a read-only view over that data)
    Route::post('/shipments/bulk-delete', [ShipmentController::class, 'bulkDestroy']);
    Route::apiResource('shipments', ShipmentController::class)->only(['index', 'show', 'destroy']);
    Route::get('/shipments/{shipment}/tracking', [ShipmentController::class, 'trackingEvents']);
    Route::post('/shipments/{shipment}/sync-tracking', [ShipmentController::class, 'syncTracking']);
    Route::post('/shipments/{shipment}/tracking-events', [TrackingEventController::class, 'store']);

    // Admin courier provider management provider config lives in the
    // backend/.env; the admin can only remove stale provider rows here.
    Route::delete('/courier-providers/{courierProvider}', [CourierProviderController::class, 'destroy']);
});
