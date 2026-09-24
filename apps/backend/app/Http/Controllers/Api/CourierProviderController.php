<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourierProviderResource;
use App\Http\Responses\ApiResponse;
use App\Models\CourierProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Provider configuration (name/code/URL template) is controlled entirely by
 * the backend carrier integrations and .env, not the Admin Panel. This
 * controller only lists providers (for the public tracking page and the
 * admin's read-only provider list) and lets the admin delete stale rows.
 */
class CourierProviderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CourierProvider::query();

        if (! $request->boolean('all')) {
            $query->where('is_active', true);
        }

        return ApiResponse::success(
            CourierProviderResource::collection($query->orderBy('name')->get()),
            'Courier providers retrieved successfully'
        );
    }

    public function destroy(CourierProvider $courierProvider): JsonResponse
    {
        $courierProvider->delete();

        return ApiResponse::success(null, 'Courier provider deleted successfully');
    }
}
