<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users
        $admin = User::where('email', 'admin@clocation.com')->first();
        $manager = User::where('email', 'manager@clocation.com')->first();
        $employee = User::where('email', 'employee@clocation.com')->first();

        // Create sample bookings
        Booking::create([
            'user_id' => $admin->id,
            'scheduledDate' => now()->addDays(1),
            'pirogue' => 'Pirogue Alpha',
            'pilot' => 'Jean Dupont',
            'copilot' => 'Marie Martin',
            'sailor' => 'Pierre Durand',
            'passengerCount' => 8,
            'departurePoint' => 'Port Principal',
            'arrivalPoint' => 'Île Paradise',
            'baggageWeight' => 150.50,
            'priority' => 'Haute',
            'requesterName' => 'Société ABC',
            'requesterCompany' => 'ABC Transport',
            'status' => 'confirmed',
        ]);

        Booking::create([
            'user_id' => $manager->id,
            'scheduledDate' => now()->addDays(3),
            'pirogue' => 'Pirogue Beta',
            'pilot' => 'Paul Moreau',
            'copilot' => 'Sophie Blanc',
            'sailor' => 'Luc Petit',
            'passengerCount' => 12,
            'departurePoint' => 'Marina Sud',
            'arrivalPoint' => 'Île Corail',
            'baggageWeight' => 200.75,
            'priority' => 'Moyenne',
            'requesterName' => 'Hôtel Lagoon',
            'requesterCompany' => 'Lagoon Resort',
            'status' => 'pending',
        ]);

        Booking::create([
            'user_id' => $employee->id,
            'scheduledDate' => now()->addDays(5),
            'pirogue' => 'Pirogue Gamma',
            'pilot' => 'Antoine Rousseau',
            'copilot' => 'Claire Dubois',
            'sailor' => 'Marc Leroy',
            'passengerCount' => 6,
            'departurePoint' => 'Quai Nord',
            'arrivalPoint' => 'Île Emeraude',
            'baggageWeight' => 80.25,
            'priority' => 'Basse',
            'requesterName' => 'Excursions Bleues',
            'requesterCompany' => 'Blue Adventures',
            'status' => 'confirmed',
        ]);

        Booking::create([
            'user_id' => $admin->id,
            'scheduledDate' => now()->subDays(2),
            'pirogue' => 'Pirogue Delta',
            'pilot' => 'François Girard',
            'copilot' => 'Isabelle Roux',
            'sailor' => 'Thomas Bernard',
            'passengerCount' => 10,
            'departurePoint' => 'Port Central',
            'arrivalPoint' => 'Île Turquoise',
            'baggageWeight' => 175.00,
            'priority' => 'Haute',
            'requesterName' => 'Groupe Voyages',
            'requesterCompany' => 'Travel Group Ltd',
            'status' => 'completed',
        ]);

        Booking::create([
            'user_id' => $manager->id,
            'scheduledDate' => now()->addWeek(),
            'pirogue' => 'Pirogue Epsilon',
            'pilot' => 'Nicolas Fabre',
            'copilot' => 'Amélie Garnier',
            'sailor' => 'Julien Mercier',
            'passengerCount' => 15,
            'departurePoint' => 'Terminal Ouest',
            'arrivalPoint' => 'Île Saphir',
            'baggageWeight' => 300.50,
            'priority' => 'Moyenne',
            'requesterName' => 'Congrès International',
            'requesterCompany' => 'Event Corp',
            'status' => 'pending',
        ]);
    }
}