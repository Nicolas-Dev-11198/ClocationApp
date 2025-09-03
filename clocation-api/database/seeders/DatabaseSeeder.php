<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call all seeders to populate the database
        $this->call([
            UserSeeder::class,
            BookingSeeder::class,
            LogbookSeeder::class,
            MaintenanceSeeder::class,
        ]);
    }
}
