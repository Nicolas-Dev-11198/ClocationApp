<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Maintenance::query();

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter by pirogue
        if ($request->has('pirogue') && $request->pirogue) {
            $query->where('pirogue', $request->pirogue);
        }

        // Filter by intervention date
        if ($request->has('intervention_date') && $request->intervention_date) {
            $query->whereDate('interventionDate', $request->intervention_date);
        }

        // Filter by intervention type
        if ($request->has('intervention_type') && $request->intervention_type) {
            $query->where('interventionType', $request->intervention_type);
        }

        // Filter by responsible pilot
        if ($request->has('responsible_pilot') && $request->responsible_pilot) {
            $query->where('responsiblePilot', 'like', '%' . $request->responsible_pilot . '%');
        }

        // Pagination
        $perPage = $request->get('per_page', 5);
        $maintenances = $query->orderBy('interventionDate', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $maintenances->items(),
            'current_page' => $maintenances->currentPage(),
            'last_page' => $maintenances->lastPage(),
            'per_page' => $maintenances->perPage(),
            'total' => $maintenances->total(),
            'from' => $maintenances->firstItem(),
            'to' => $maintenances->lastItem()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'location' => 'required|string|max:255',
            'pirogue' => 'required|string|max:255',
            'motorBrand' => ['required', Rule::in(['Yamaha', 'Suzuki'])],
            'equipmentSpecs' => 'required|string|max:255',
            'interventionDate' => 'required|date',
            'interventionType' => ['required', Rule::in(['diagnostic', 'reparation', 'maintenance'])],
            'responsiblePilot' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'reference' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'workDescription' => 'required|string',
            'mechanicValidated' => 'boolean',
            'pilotValidated' => 'boolean',
            'hseValidated' => 'boolean',
        ]);

        $maintenance = Maintenance::create($validated);

        return response()->json($maintenance, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Maintenance $maintenance): JsonResponse
    {
        return response()->json($maintenance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Maintenance $maintenance): JsonResponse
    {
        $validated = $request->validate([
            'location' => 'sometimes|required|string|max:255',
            'pirogue' => 'sometimes|required|string|max:255',
            'motorBrand' => ['sometimes', 'required', Rule::in(['Yamaha', 'Suzuki'])],
            'equipmentSpecs' => 'sometimes|required|string|max:255',
            'interventionDate' => 'sometimes|required|date',
            'interventionType' => ['sometimes', 'required', Rule::in(['diagnostic', 'reparation', 'maintenance'])],
            'responsiblePilot' => 'sometimes|required|string|max:255',
            'designation' => 'sometimes|required|string|max:255',
            'reference' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:1',
            'workDescription' => 'sometimes|required|string',
            'mechanicValidated' => 'sometimes|boolean',
            'pilotValidated' => 'sometimes|boolean',
            'hseValidated' => 'sometimes|boolean',
        ]);

        $maintenance->update($validated);

        return response()->json($maintenance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Maintenance $maintenance): JsonResponse
    {
        $maintenance->delete();

        return response()->json(null, 204);
    }

    /**
     * Get maintenance statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Maintenance::count(),
            'by_type' => Maintenance::selectRaw('interventionType, count(*) as count')
                ->groupBy('interventionType')
                ->pluck('count', 'interventionType'),
            'by_pirogue' => Maintenance::selectRaw('pirogue, count(*) as count')
                ->groupBy('pirogue')
                ->pluck('count', 'pirogue'),
            'validated' => [
                'mechanic' => Maintenance::where('mechanicValidated', true)->count(),
                'pilot' => Maintenance::where('pilotValidated', true)->count(),
                'hse' => Maintenance::where('hseValidated', true)->count(),
            ],
        ];

        return response()->json($stats);
    }
}