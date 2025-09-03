<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample maintenance records
        Maintenance::create([
            'location' => 'Atelier Principal',
            'pirogue' => 'Pirogue Alpha',
            'motorBrand' => 'Yamaha',
            'equipmentSpecs' => 'Moteur hors-bord 4 temps, système d\'injection électronique',
            'interventionDate' => now()->subDays(5),
            'interventionType' => 'maintenance',
            'responsiblePilot' => 'Jean Dupont',
            'designation' => 'Révision moteur',
            'reference' => 'REV-2024-001',
            'quantity' => 1,
            'workDescription' => 'Vidange huile moteur, remplacement filtre à huile, vérification système d\'allumage, contrôle hélice',
            'mechanicValidated' => true,
            'pilotValidated' => true,
            'hseValidated' => true,
        ]);

        Maintenance::create([
            'location' => 'Dock de Maintenance',
            'pirogue' => 'Pirogue Beta',
            'motorBrand' => 'Suzuki',
            'equipmentSpecs' => 'Moteur hors-bord 2 temps, système de refroidissement par eau de mer',
            'interventionDate' => now()->subDays(3),
            'interventionType' => 'reparation',
            'responsiblePilot' => 'Paul Moreau',
            'designation' => 'Réparation pompe à eau',
            'reference' => 'REP-2024-002',
            'quantity' => 1,
            'workDescription' => 'Remplacement pompe à eau défectueuse, test système de refroidissement, vérification thermostat',
            'mechanicValidated' => true,
            'pilotValidated' => true,
            'hseValidated' => false,
        ]);

        Maintenance::create([
            'location' => 'Atelier Électronique',
            'pirogue' => 'Pirogue Gamma',
            'motorBrand' => 'Yamaha',
            'equipmentSpecs' => 'Moteur hors-bord 4 temps, système de navigation GPS intégré',
            'interventionDate' => now()->subDays(1),
            'interventionType' => 'maintenance',
            'responsiblePilot' => 'Antoine Rousseau',
            'designation' => 'Installation nouveau GPS',
            'reference' => 'UPG-2024-003',
            'quantity' => 1,
            'workDescription' => 'Installation système GPS Garmin, calibrage compas électronique, formation pilote',
            'mechanicValidated' => true,
            'pilotValidated' => false,
            'hseValidated' => true,
        ]);

        Maintenance::create([
            'location' => 'Atelier Principal',
            'pirogue' => 'Pirogue Delta',
            'motorBrand' => 'Suzuki',
            'equipmentSpecs' => 'Moteur hors-bord 4 temps, système d\'injection directe',
            'interventionDate' => now(),
            'interventionType' => 'diagnostic',
            'responsiblePilot' => 'François Girard',
            'designation' => 'Inspection annuelle',
            'reference' => 'INS-2024-004',
            'quantity' => 1,
            'workDescription' => 'Inspection complète coque, vérification équipements sécurité, test moteur, contrôle électronique',
            'mechanicValidated' => false,
            'pilotValidated' => false,
            'hseValidated' => false,
        ]);

        Maintenance::create([
            'location' => 'Dock de Maintenance',
            'pirogue' => 'Pirogue Epsilon',
            'motorBrand' => 'Yamaha',
            'equipmentSpecs' => 'Moteur hors-bord 2 temps, système E-TEC',
            'interventionDate' => now()->addDays(2),
            'interventionType' => 'maintenance',
            'responsiblePilot' => 'Nicolas Fabre',
            'designation' => 'Entretien saisonnier',
            'reference' => 'ENT-2024-005',
            'quantity' => 1,
            'workDescription' => 'Nettoyage carburateurs, remplacement bougies, vérification système électrique, test compression',
            'mechanicValidated' => false,
            'pilotValidated' => false,
            'hseValidated' => false,
        ]);

        Maintenance::create([
            'location' => 'Atelier Spécialisé',
            'pirogue' => 'Pirogue Alpha',
            'motorBrand' => 'Yamaha',
            'equipmentSpecs' => 'Moteur hors-bord 4 temps, système d\'injection électronique',
            'interventionDate' => now()->subWeeks(2),
            'interventionType' => 'reparation',
            'responsiblePilot' => 'Jean Dupont',
            'designation' => 'Réparation hélice',
            'reference' => 'URG-2024-006',
            'quantity' => 1,
            'workDescription' => 'Remplacement hélice endommagée suite à impact, vérification arbre de transmission, équilibrage',
            'mechanicValidated' => true,
            'pilotValidated' => true,
            'hseValidated' => true,
        ]);

        Maintenance::create([
            'location' => 'Atelier Principal',
            'pirogue' => 'Pirogue Beta',
            'motorBrand' => 'Suzuki',
            'equipmentSpecs' => 'Moteur hors-bord 2 temps, système de refroidissement par eau de mer',
            'interventionDate' => now()->addWeek(),
            'interventionType' => 'maintenance',
            'responsiblePilot' => 'Paul Moreau',
            'designation' => 'Révision 500h',
            'reference' => 'REV-2024-007',
            'quantity' => 1,
            'workDescription' => 'Révision complète moteur 500 heures, remplacement pièces d\'usure, test performance',
            'mechanicValidated' => false,
            'pilotValidated' => false,
            'hseValidated' => false,
        ]);
    }
}