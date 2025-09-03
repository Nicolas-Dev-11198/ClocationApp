<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LogbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Logbook::with(['user', 'booking']);
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('vehicle_id')) {
            $query->where('vehicleId', $request->vehicle_id);
        }
        
        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 5);
        $logbooks = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $logbooks->items(),
            'pagination' => [
                'current_page' => $logbooks->currentPage(),
                'last_page' => $logbooks->lastPage(),
                'per_page' => $logbooks->perPage(),
                'total' => $logbooks->total(),
                'from' => $logbooks->firstItem(),
                'to' => $logbooks->lastItem()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'nullable|exists:bookings,id',
            'pirogue' => 'required|string|max:255',
            'pilot' => 'required|string|max:255',
            'copilot' => 'nullable|string|max:255',
            'sailor' => 'nullable|string|max:255',
            'date' => 'required|date',
            'safetyChecklist' => 'required|array',
            'trips' => 'required|array',
            'comments' => 'nullable|string|max:1000',
            'mechanicalIntervention' => 'boolean',
            'pilotValidated' => 'boolean',
            'logisticsValidated' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $logbook = Logbook::create([
            'user_id' => Auth::id(),
            'booking_id' => $request->booking_id,
            'pirogue' => $request->pirogue,
            'pilot' => $request->pilot,
            'copilot' => $request->copilot,
            'sailor' => $request->sailor,
            'date' => $request->date,
            'safetyChecklist' => $request->safetyChecklist,
            'trips' => $request->trips,
            'comments' => $request->comments,
            'mechanicalIntervention' => $request->mechanicalIntervention ?? false,
            'pilotValidated' => $request->pilotValidated ?? false,
            'logisticsValidated' => $request->logisticsValidated ?? false,
        ]);

        $logbook->load(['user', 'booking']);

        return response()->json([
            'success' => true,
            'message' => 'Logbook created successfully',
            'logbook' => $logbook
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $logbook = Logbook::with(['user', 'booking'])->find($id);
        
        if (!$logbook) {
            return response()->json([
                'success' => false,
                'message' => 'Logbook not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $logbook
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $logbook = Logbook::find($id);
        
        if (!$logbook) {
            return response()->json([
                'success' => false,
                'message' => 'Logbook not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'booking_id' => 'sometimes|nullable|exists:bookings,id',
            'pirogue' => 'sometimes|required|string|max:255',
            'pilot' => 'sometimes|required|string|max:255',
            'copilot' => 'nullable|string|max:255',
            'sailor' => 'nullable|string|max:255',
            'date' => 'sometimes|required|date',
            'safetyChecklist' => 'sometimes|required|array',
            'trips' => 'sometimes|required|array',
            'comments' => 'nullable|string|max:1000',
            'mechanicalIntervention' => 'boolean',
            'pilotValidated' => 'boolean',
            'logisticsValidated' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $logbook->update($request->only([
            'booking_id', 'pirogue', 'pilot', 'copilot', 'sailor',
            'date', 'safetyChecklist', 'trips', 'comments',
            'mechanicalIntervention', 'pilotValidated', 'logisticsValidated'
        ]));

        $logbook->load(['user', 'booking']);

        return response()->json([
            'success' => true,
            'message' => 'Logbook updated successfully',
            'logbook' => $logbook
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $logbook = Logbook::find($id);
        
        if (!$logbook) {
            return response()->json([
                'success' => false,
                'message' => 'Logbook not found'
            ], 404);
        }
        
        $logbook->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Logbook deleted successfully'
        ]);
    }

    /**
     * Get logbooks for a specific user.
     */
    public function getByUser(string $userId)
    {
        $logbooks = Logbook::with(['user', 'booking'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $logbooks
        ]);
    }
}
