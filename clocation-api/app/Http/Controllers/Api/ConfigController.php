<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /**
     * Get allowed roles for user registration
     */
    public function getAllowedRoles(): JsonResponse
    {
        $allowedRoles = [
            'directeur',
            'rh',
            'pilote',
            'mecanicien',
            'logisticien'
        ];

        return response()->json($allowedRoles);
    }

    /**
     * Get safety checklist items
     */
    public function getSafetyChecklistItems(): JsonResponse
    {
        $checklistItems = [
            ['key' => 'fuel_check', 'label' => 'Vérification du carburant'],
            ['key' => 'engine_check', 'label' => 'Vérification du moteur'],
            ['key' => 'safety_equipment', 'label' => 'Équipement de sécurité'],
            ['key' => 'navigation_equipment', 'label' => 'Équipement de navigation'],
            ['key' => 'communication_equipment', 'label' => 'Équipement de communication'],
            ['key' => 'hull_inspection', 'label' => 'Inspection de la coque'],
            ['key' => 'weather_conditions', 'label' => 'Conditions météorologiques'],
            ['key' => 'emergency_procedures', 'label' => 'Procédures d\'urgence']
        ];

        return response()->json($checklistItems);
    }

    /**
     * Get available pirogues
     */
    public function getPirogues(): JsonResponse
    {
        $pirogues = [
            'Pirogue Alpha',
            'Pirogue Beta',
            'Pirogue Gamma',
            'Pirogue Delta',
            'Pirogue Epsilon'
        ];

        return response()->json($pirogues);
    }

    /**
     * Get available locations
     */
    public function getLocations(): JsonResponse
    {
        $locations = [
            'Port de Cayenne',
            'Îles du Salut',
            'Saint-Laurent-du-Maroni',
            'Kourou',
            'Sinnamary',
            'Iracoubo',
            'Mana',
            'Awala-Yalimapo',
            'Grand-Santi',
            'Maripasoula'
        ];

        return response()->json($locations);
    }

    /**
     * Get available pilots
     */
    public function getPilots(): JsonResponse
    {
        $pilots = [
            'Jean Dupont',
            'Marie Martin',
            'Pierre Durand',
            'Sophie Leroy',
            'Antoine Bernard'
        ];

        return response()->json($pilots);
    }

    /**
     * Get maintenance types
     */
    public function getMaintenanceTypes(): JsonResponse
    {
        $maintenanceTypes = [
            'Préventive',
            'Corrective',
            'Urgente',
            'Révision'
        ];

        return response()->json($maintenanceTypes);
    }

    /**
     * Get all configuration data
     */
    public function getAll(): JsonResponse
    {
        return response()->json([
            'allowedRoles' => $this->getAllowedRoles()->getData(),
            'safetyChecklistItems' => $this->getSafetyChecklistItems()->getData(),
            'pirogues' => $this->getPirogues()->getData(),
            'locations' => $this->getLocations()->getData(),
            'pilots' => $this->getPilots()->getData(),
            'maintenanceTypes' => $this->getMaintenanceTypes()->getData()
        ]);
    }
}