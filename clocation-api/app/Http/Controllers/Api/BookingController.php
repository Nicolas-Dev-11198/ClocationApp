<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Booking::with('user');
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('pirogue')) {
            $query->where('pirogue', $request->pirogue);
        }
        
        if ($request->has('pilot')) {
            $query->where('pilot', $request->pilot);
        }
        
        if ($request->has('scheduled_date')) {
            $query->where('scheduledDate', '>=', $request->scheduled_date);
        }
        
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 5);
        $bookings = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $bookings->items(),
            'pagination' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'from' => $bookings->firstItem(),
                'to' => $bookings->lastItem()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scheduledDate' => 'required|date',
            'pirogue' => 'required|string|max:255',
            'pilot' => 'required|string|max:255',
            'copilot' => 'nullable|string|max:255',
            'sailor' => 'nullable|string|max:255',
            'passengerCount' => 'required|integer|min:1',
            'departurePoint' => 'required|string|max:255',
            'arrivalPoint' => 'required|string|max:255',
            'baggageWeight' => 'required|numeric|min:0',
            'priority' => 'required|string|in:Haute,Moyenne,Basse',
            'requesterName' => 'required|string|max:255',
            'requesterCompany' => 'required|string|max:255',
            'status' => 'nullable|string|in:pending,confirmed,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'scheduledDate' => $request->scheduledDate,
            'pirogue' => $request->pirogue,
            'pilot' => $request->pilot,
            'copilot' => $request->copilot,
            'sailor' => $request->sailor,
            'passengerCount' => $request->passengerCount,
            'departurePoint' => $request->departurePoint,
            'arrivalPoint' => $request->arrivalPoint,
            'baggageWeight' => $request->baggageWeight,
            'priority' => $request->priority,
            'requesterName' => $request->requesterName,
            'requesterCompany' => $request->requesterCompany,
            'status' => $request->status ?? 'pending',
        ]);

        $booking->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::with('user')->find($id);
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'scheduledDate' => 'sometimes|required|date',
            'pirogue' => 'sometimes|required|string|max:255',
            'pilot' => 'sometimes|required|string|max:255',
            'copilot' => 'nullable|string|max:255',
            'sailor' => 'nullable|string|max:255',
            'passengerCount' => 'sometimes|required|integer|min:1',
            'departurePoint' => 'sometimes|required|string|max:255',
            'arrivalPoint' => 'sometimes|required|string|max:255',
            'baggageWeight' => 'sometimes|required|numeric|min:0',
            'priority' => 'sometimes|required|string|in:Haute,Moyenne,Basse',
            'requesterName' => 'sometimes|required|string|max:255',
            'requesterCompany' => 'sometimes|required|string|max:255',
            'status' => 'nullable|string|in:pending,confirmed,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update($request->only([
            'scheduledDate', 'pirogue', 'pilot', 'copilot', 'sailor',
            'passengerCount', 'departurePoint', 'arrivalPoint', 
            'baggageWeight', 'priority', 'requesterName', 'requesterCompany', 'status'
        ]));

        $booking->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Booking updated successfully',
            'booking' => $booking
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
        
        $booking->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ]);
    }

    /**
     * Get bookings for a specific user.
     */
    public function getByUser(string $userId)
    {
        $bookings = Booking::with('user')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Update booking status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $booking = Booking::find($id);
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,confirmed,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update(['status' => $request->status]);
        $booking->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully',
            'booking' => $booking
        ]);
    }
}
