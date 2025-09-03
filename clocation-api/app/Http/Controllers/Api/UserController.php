<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query()->select([
            'id', 'name', 'email', 'role', 'status', 'phone', 
            'department', 'position', 'created_at', 'updated_at',
            'hireDate', 'firstName', 'lastName', 'salary', 'address',
            'contractStart', 'contractEnd', 'medicalVisitStart', 'medicalVisitEnd',
            'derogationStart', 'derogationEnd', 'inductionStart', 'inductionEnd',
            'cnssNumber', 'payrollNumber', 'approved_by', 'approved_at'
        ]);
        
        // Apply filters
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        // Add pagination to avoid timeouts
        $perPage = $request->get('per_page', 5);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|string|in:directeur,pilote,mecanicien,logisticien,rh',
            'status' => 'nullable|string|in:active,inactive',
            'license_number' => 'nullable|string|max:255',
            'license_expiry' => 'nullable|date',
            'hire_date' => 'nullable|date',
            'department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $request->role,
            'status' => $request->status ?? 'active',
            'license_number' => $request->license_number,
            'license_expiry' => $request->license_expiry,
            'hire_date' => $request->hire_date,
            'department' => $request->department,
        ]);

        // Remove password from response
        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        
        // Remove password from response
        $user->makeHidden(['password']);
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|required|string|in:directeur,pilote,mecanicien,logisticien,rh',
            'status' => 'nullable|string|in:active,inactive',
            'license_number' => 'nullable|string|max:255',
            'license_expiry' => 'nullable|date',
            'hire_date' => 'nullable|date',
            'department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'name', 'email', 'phone', 'role', 'status',
            'license_number', 'license_expiry', 'hire_date', 'department'
        ]);

        // Hash password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Remove password from response
        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        
        // Prevent deleting the current authenticated user
        if (Auth::id() == $id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete your own account'
            ], 403);
        }
        
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get users by role.
     */
    public function getByRole(string $role)
    {
        $users = User::where('role', $role)
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->makeHidden(['password']);
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Update user status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,approved,rejected,active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update([
            'status' => $request->status
        ]);

        // Remove password from response
        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get current authenticated user profile.
     */
    public function profile()
    {
        $user = Auth::user();
        $user->makeHidden(['password']);
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update current authenticated user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'current_password' => 'required_with:password|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify current password if changing password
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }
        }

        $updateData = $request->only(['name', 'email', 'phone']);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);
        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get pending users for HR approval.
     */
    public function getPendingUsers()
    {
        $users = User::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get()
            ->makeHidden(['password']);
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Approve a user.
     */
    public function approveUser(string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now()
        ]);

        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'User approved successfully',
            'user' => $user
        ]);
    }

    /**
     * Reject a user.
     */
    public function rejectUser(string $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now()
        ]);

        $user->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'message' => 'User rejected successfully',
            'user' => $user
        ]);
    }
}
