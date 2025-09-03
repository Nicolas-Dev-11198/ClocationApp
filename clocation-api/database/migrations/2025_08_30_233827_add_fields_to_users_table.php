<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('firstName')->after('email');
            $table->string('lastName')->after('firstName');
            $table->enum('role', ['admin', 'manager', 'employee'])->default('employee')->after('lastName');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('role');
            $table->string('department')->nullable()->after('status');
            $table->string('position')->nullable()->after('department');
            $table->date('hireDate')->nullable()->after('position');
            $table->decimal('salary', 10, 2)->nullable()->after('hireDate');
            $table->string('phone')->nullable()->after('salary');
            $table->text('address')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'firstName', 'lastName', 'role', 'status', 
                'department', 'position', 'hireDate', 'salary', 
                'phone', 'address'
            ]);
        });
    }
};
