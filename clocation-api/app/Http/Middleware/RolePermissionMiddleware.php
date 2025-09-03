<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RolePermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Check if user is active
        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Account not active or pending approval'
            ], 403);
        }

        // Define role permissions
        $rolePermissions = $this->getRolePermissions();
        
        $userRole = $user->role;
        $userPermissions = $rolePermissions[$userRole] ?? [];
        
        // Check if user has required permissions
        foreach ($permissions as $permission) {
            if (!in_array($permission, $userPermissions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient permissions'
                ], 403);
            }
        }
        
        return $next($request);
    }
    
    /**
     * Get role permissions mapping
     */
    private function getRolePermissions(): array
    {
        return [
            'director' => [
                'manage_users',
                'manage_bookings',
                'manage_logbook',
                'manage_maintenance',
                'validate_maintenance',
                'view_reports',
                'export_data'
            ],
            'rh' => [
                'manage_users',
                'approve_users',
                'view_reports',
                'export_data',
                'manage_logbook',
                'manage_maintenance'
            ],
            'pilote' => [
                'manage_bookings',
                'manage_logbook',
                'validate_maintenance',
                'view_own_data'
            ],
            'mecanicien' => [
                'manage_maintenance',
                'view_maintenance_reports'
            ],
            'logisticien' => [
                'manage_bookings',
                'view_booking_reports',
                'manage_maintenance',
                'validate_maintenance',
                'manage_users',
                'manage_logbook'
            ]
        ];
    }
}