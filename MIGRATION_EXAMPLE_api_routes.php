<?php
// routes/api.php
use App\Http\Controllers\Api\PlantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataExportController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

// Protected plant routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('plants')->group(function () {
        // GET /api/plants - List all plants
        Route::get('/', [PlantController::class, 'index']);
        
        // GET /api/plants/{id} - Get plant data with date range
        Route::get('/{plant}', [PlantController::class, 'show']);
        
        // POST /api/plants/{id}/export - Export plant data
        Route::post('/{plant}/export', [DataExportController::class, 'export']);
    });
});
