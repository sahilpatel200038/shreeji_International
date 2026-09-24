<?php

use Illuminate\Support\Facades\Route;

// This backend is a JSON API only — the customer-facing site and admin
// panel are a separate frontend application. The root route exists purely
// so hitting the bare domain returns something sane instead of a 404; real
// health checks should use the framework's built-in /up route, and real
// traffic goes through /api/*.
Route::get('/', function () {
    return response()->json([
        'service' => 'Shreeji International Courier — Tracking API',
        'status' => 'ok',
    ]);
});
