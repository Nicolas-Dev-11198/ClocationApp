<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\LogbookController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ExportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check route
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()
    ]);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Public configuration routes (accessible without authentication)
Route::prefix('config')->group(function () {
    Route::get('/allowed-roles', [ConfigController::class, 'getAllowedRoles']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // User routes
    Route::apiResource('users', UserController::class)->middleware('role.permission:manage_users');
    Route::get('users/pending/list', [UserController::class, 'getPendingUsers'])->middleware('role.permission:approve_users');
    Route::patch('users/{id}/approve', [UserController::class, 'approveUser'])->middleware('role.permission:approve_users');
    Route::patch('users/{id}/reject', [UserController::class, 'rejectUser'])->middleware('role.permission:approve_users');
    Route::patch('users/{id}/status', [UserController::class, 'updateStatus'])->middleware('role.permission:manage_users');
    Route::get('users/role/{role}', [UserController::class, 'getByRole'])->middleware('role.permission:manage_users');
    
    // Booking routes
    Route::apiResource('bookings', BookingController::class)->middleware('role.permission:manage_bookings');
    Route::get('bookings/user/{userId}', [BookingController::class, 'getByUser'])->middleware('role.permission:manage_bookings');
    
    // Logbook routes
    Route::apiResource('logbooks', LogbookController::class)->middleware('role.permission:manage_logbook');
    Route::get('logbooks/user/{userId}', [LogbookController::class, 'getByUser'])->middleware('role.permission:manage_logbook');
    Route::get('logbooks/booking/{bookingId}', [LogbookController::class, 'getByBooking'])->middleware('role.permission:manage_logbook');
    
    // Maintenance routes
    Route::apiResource('maintenances', MaintenanceController::class)->middleware('role.permission:manage_maintenance');
    Route::get('maintenances/stats', [MaintenanceController::class, 'stats'])->middleware('role.permission:manage_maintenance');
    Route::patch('maintenances/{id}/validate', [\App\Http\Controllers\Api\MaintenanceController::class, 'validateMaintenance'])->middleware('role.permission:validate_maintenance');
    
    // Reports routes
    Route::prefix('reports')->middleware('role.permission:view_reports')->group(function () {
        Route::get('/bookings', [BookingController::class, 'getReports']);
        Route::get('/logbooks', [LogbookController::class, 'getReports']);
        Route::get('/maintenances', [MaintenanceController::class, 'getReports']);
    });
    
    // Export routes
    Route::prefix('exports')->middleware('role.permission:export_data')->group(function () {
        Route::get('/bookings', [ExportController::class, 'exportBookings']);
        Route::get('/logbooks', [ExportController::class, 'exportLogbooks']);
        Route::get('/logbooks/{id}/pdf', [ExportController::class, 'exportSingleLogbook']);
        Route::get('/maintenances', [ExportController::class, 'exportMaintenances']);
        Route::get('/maintenances/{id}/pdf', [ExportController::class, 'exportSingleMaintenance']);
        Route::get('/users', [ExportController::class, 'exportUsers']);
    });
    
    // Protected configuration routes
    Route::prefix('config')->group(function () {
        Route::get('/safety-checklist-items', [ConfigController::class, 'getSafetyChecklistItems']);
        Route::get('/pirogues', [ConfigController::class, 'getPirogues']);
        Route::get('/locations', [ConfigController::class, 'getLocations']);
        Route::get('/pilots', [ConfigController::class, 'getPilots']);
        Route::get('/maintenance-types', [ConfigController::class, 'getMaintenanceTypes']);
        Route::get('/all', [ConfigController::class, 'getAll']);
    });
});