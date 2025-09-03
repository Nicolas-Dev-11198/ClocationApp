<?php

namespace Database\Seeders;

use App\Models\Logbook;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LogbookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and bookings
        $admin = User::where('email', 'admin@clocation.com')->first();
        $manager = User::where('email', 'manager@clocation.com')->first();
        $employee = User::where('email', 'employee@clocation.com')->first();
        
        $completedBooking = Booking::where('status', 'completed')->first();
        $confirmedBookings = Booking::where('status', 'confirmed')->get();

        // Create logbook for completed booking
        if ($completedBooking) {
            Logbook::create([
                'user_id' => $admin->id,
                'booking_id' => $completedBooking->id,
                'pirogue' => $completedBooking->pirogue,
                'pilot' => $completedBooking->pilot,
                'copilot' => $completedBooking->copilot,
                'sailor' => $completedBooking->sailor,
                'date' => $completedBooking->scheduledDate,
                'safetyChecklist' => [
                    'lifeJackets' => true,
                    'fireExtinguisher' => true,
                    'firstAidKit' => true,
                    'emergencyFlares' => true,
                    'radio' => true,
                    'gps' => true,
                    'anchor' => true,
                    'bilgePump' => true,
                    'fuelLevel' => true,
                    'engineCheck' => true,
                    'hullInspection' => true,
                    'weatherCheck' => true,
                    'passengerBriefing' => true,
                    'emergencyProcedures' => true,
                    'toolboxTheme' => 'Sécurité maritime standard'
                ],
                'trips' => [
                    [
                        'departurePoint' => 'Port Central',
                        'departureTime' => '08:00',
                        'departureFuel' => 95.5,
                        'arrivalPoint' => 'Île Turquoise',
                        'arrivalTime' => '10:30',
                        'arrivalFuel' => 78.2
                    ],
                    [
                        'departurePoint' => 'Île Turquoise',
                        'departureTime' => '15:00',
                        'departureFuel' => 78.2,
                        'arrivalPoint' => 'Port Central',
                        'arrivalTime' => '17:15',
                        'arrivalFuel' => 62.8
                    ]
                ],
                'comments' => 'Voyage effectué dans de bonnes conditions météorologiques. Passagers satisfaits.',
                'mechanicalIntervention' => false,
                'pilotValidated' => true,
                'logisticsValidated' => true,
            ]);
        }

        // Create logbook for first confirmed booking
        if ($confirmedBookings->count() > 0) {
            $firstConfirmed = $confirmedBookings->first();
            Logbook::create([
                'user_id' => $manager->id,
                'booking_id' => $firstConfirmed->id,
                'pirogue' => $firstConfirmed->pirogue,
                'pilot' => $firstConfirmed->pilot,
                'copilot' => $firstConfirmed->copilot,
                'sailor' => $firstConfirmed->sailor,
                'date' => now(),
                'safetyChecklist' => [
                    'lifeJackets' => true,
                    'fireExtinguisher' => true,
                    'firstAidKit' => true,
                    'emergencyFlares' => true,
                    'radio' => true,
                    'gps' => true,
                    'anchor' => true,
                    'bilgePump' => false,
                    'fuelLevel' => true,
                    'engineCheck' => true,
                    'hullInspection' => true,
                    'weatherCheck' => true,
                    'passengerBriefing' => true,
                    'emergencyProcedures' => true,
                    'toolboxTheme' => 'Vérification pompe de cale nécessaire'
                ],
                'trips' => [
                    [
                        'departurePoint' => 'Port Principal',
                        'departureTime' => '09:15',
                        'departureFuel' => 88.7,
                        'arrivalPoint' => 'Île Paradise',
                        'arrivalTime' => '11:45',
                        'arrivalFuel' => 72.3
                    ]
                ],
                'comments' => 'Problème mineur avec la pompe de cale détecté lors de la vérification. Voyage reporté pour maintenance.',
                'mechanicalIntervention' => true,
                'pilotValidated' => true,
                'logisticsValidated' => false,
            ]);
        }

        // Create another sample logbook
        Logbook::create([
            'user_id' => $employee->id,
            'booking_id' => null, // Logbook sans réservation associée
            'pirogue' => 'Pirogue Test',
            'pilot' => 'Capitaine Expérience',
            'copilot' => 'Second Novice',
            'sailor' => 'Marin Confirmé',
            'date' => now()->subDays(1),
            'safetyChecklist' => [
                'lifeJackets' => true,
                'fireExtinguisher' => true,
                'firstAidKit' => true,
                'emergencyFlares' => true,
                'radio' => true,
                'gps' => true,
                'anchor' => true,
                'bilgePump' => true,
                'fuelLevel' => true,
                'engineCheck' => true,
                'hullInspection' => true,
                'weatherCheck' => true,
                'passengerBriefing' => true,
                'emergencyProcedures' => true,
                'toolboxTheme' => 'Formation sécurité équipage'
            ],
            'trips' => [
                [
                    'departurePoint' => 'Base Formation',
                    'departureTime' => '14:00',
                    'departureFuel' => 100.0,
                    'arrivalPoint' => 'Zone Exercice',
                    'arrivalTime' => '15:30',
                    'arrivalFuel' => 92.5
                ],
                [
                    'departurePoint' => 'Zone Exercice',
                    'departureTime' => '16:00',
                    'departureFuel' => 92.5,
                    'arrivalPoint' => 'Base Formation',
                    'arrivalTime' => '17:15',
                    'arrivalFuel' => 85.8
                ]
            ],
            'comments' => 'Session de formation pour nouveau copilote. Exercices de manœuvres et procédures d\'urgence effectués.',
            'mechanicalIntervention' => false,
            'pilotValidated' => true,
            'logisticsValidated' => true,
        ]);
    }
}