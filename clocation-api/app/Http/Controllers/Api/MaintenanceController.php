<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Maintenance::query();
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('vehicle_id')) {
            $query->where('vehicleId', $request->vehicle_id);
        }
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('scheduled_date')) {
            $query->whereDate('scheduledDate', $request->scheduled_date);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 5);
        $maintenances = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $maintenances->items(),
            'pagination' => [
                'current_page' => $maintenances->currentPage(),
                'last_page' => $maintenances->lastPage(),
                'per_page' => $maintenances->perPage(),
                'total' => $maintenances->total(),
                'from' => $maintenances->firstItem(),
                'to' => $maintenances->lastItem()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location' => 'required|string|max:255',
            'pirogue' => 'required|string|max:255',
            'motorBrand' => 'required|string|in:Yamaha,Suzuki',
            'equipmentSpecs' => 'required|string|max:255',
            'interventionDate' => 'required|date',
            'interventionType' => 'required|string|in:diagnostic,reparation,maintenance',
            'responsiblePilot' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'reference' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'workDescription' => 'required|string|max:1000',
            'mechanicValidated' => 'boolean',
            'pilotValidated' => 'boolean',
            'hseValidated' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $maintenance = Maintenance::create([
            'location' => $request->location,
            'pirogue' => $request->pirogue,
            'motorBrand' => $request->motorBrand,
            'equipmentSpecs' => $request->equipmentSpecs,
            'interventionDate' => $request->interventionDate,
            'interventionType' => $request->interventionType,
            'responsiblePilot' => $request->responsiblePilot,
            'designation' => $request->designation,
            'reference' => $request->reference,
            'quantity' => $request->quantity,
            'workDescription' => $request->workDescription,
            'mechanicValidated' => $request->mechanicValidated ?? false,
            'pilotValidated' => $request->pilotValidated ?? false,
            'hseValidated' => $request->hseValidated ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance created successfully',
            'maintenance' => $maintenance
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $maintenance = Maintenance::find($id);
        
        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $maintenance
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $maintenance = Maintenance::find($id);
        
        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'location' => 'sometimes|required|string|max:255',
            'pirogue' => 'sometimes|required|string|max:255',
            'motorBrand' => 'sometimes|required|string|in:Yamaha,Suzuki',
            'equipmentSpecs' => 'sometimes|required|string|max:255',
            'interventionDate' => 'sometimes|required|date',
            'interventionType' => 'sometimes|required|string|in:diagnostic,reparation,maintenance',
            'responsiblePilot' => 'sometimes|required|string|max:255',
            'designation' => 'sometimes|required|string|max:255',
            'reference' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:1',
            'workDescription' => 'sometimes|required|string|max:1000',
            'mechanicValidated' => 'boolean',
            'pilotValidated' => 'boolean',
            'hseValidated' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $maintenance->update($request->only([
            'location', 'pirogue', 'motorBrand', 'equipmentSpecs',
            'interventionDate', 'interventionType', 'responsiblePilot',
            'designation', 'reference', 'quantity', 'workDescription',
            'mechanicValidated', 'pilotValidated', 'hseValidated'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Maintenance updated successfully',
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $maintenance = Maintenance::find($id);
        
        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance not found'
            ], 404);
        }
        
        $maintenance->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Maintenance deleted successfully'
        ]);
    }

    /**
     * Get maintenances for a specific vehicle.
     */
    public function getByVehicle(string $vehicleId)
    {
        $maintenances = Maintenance::where('vehicleId', $vehicleId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $maintenances
        ]);
    }

    /**
     * Update maintenance status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $maintenance = Maintenance::find($id);
        
        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:scheduled,in_progress,completed,cancelled',
            'completedDate' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $maintenance->update([
            'status' => $request->status,
            'completedDate' => $request->completedDate
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance status updated successfully',
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Validate maintenance report by admin, logisticien or pilote.
     */
    public function validateMaintenance(Request $request, string $id)
    {
        $maintenance = Maintenance::find($id);
        
        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance not found'
            ], 404);
        }

        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'validation_type' => 'required|string|in:pilot,admin,logistics',
            'validated' => 'required|boolean',
            'comments' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validationType = $request->validation_type;
        $validated = $request->validated;
        
        // Update the appropriate validation field based on user role and validation type
        $updateData = [];
        
        if ($validationType === 'pilot' && in_array($user->role, ['pilote', 'director'])) {
            $updateData['pilotValidated'] = $validated;
        } elseif ($validationType === 'admin' && in_array($user->role, ['director'])) {
            $updateData['hseValidated'] = $validated; // HSE validation by admin/director
        } elseif ($validationType === 'logistics' && in_array($user->role, ['logisticien', 'director'])) {
            $updateData['hseValidated'] = $validated; // Logistics can also do HSE validation
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized validation type for your role'
            ], 403);
        }

        if ($request->comments) {
            $updateData['validation_comments'] = $request->comments;
        }

        $maintenance->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance validation updated successfully',
            'maintenance' => $maintenance
        ]);
    }
}
