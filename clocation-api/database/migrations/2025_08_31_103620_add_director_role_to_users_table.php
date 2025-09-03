<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the enum to include 'director'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'employee', 'director') DEFAULT 'employee'");
        
        // Update the admin user to have director role
        DB::table('users')
            ->where('email', 'admin@clocation.com')
            ->update(['role' => 'director']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert admin user back to admin role
        DB::table('users')
            ->where('email', 'admin@clocation.com')
            ->update(['role' => 'admin']);
            
        // Remove 'director' from enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'employee') DEFAULT 'employee'");
    }
};
