<?php

use App\Http\Controllers\Api\DataController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TranController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard statistics
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Iuran-specific endpoints (must be before apiResource)
    Route::post('/tran/batch-iuran', [TranController::class, 'batchIuran']);
    Route::get('/tran/iuran-summary', [TranController::class, 'iuranSummary']);

    Route::apiResource('data', DataController::class);
    Route::apiResource('tran', TranController::class);

    // Serve KTP file securely
    Route::get('/files/ktp/{path}', [TranController::class, 'serveKtp'])
        ->where('path', '.*');
});
