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
            $table->date('contractStart')->nullable()->after('hireDate');
            $table->date('contractEnd')->nullable()->after('contractStart');
            $table->date('medicalVisitStart')->nullable()->after('contractEnd');
            $table->date('medicalVisitEnd')->nullable()->after('medicalVisitStart');
            $table->date('derogationStart')->nullable()->after('medicalVisitEnd');
            $table->date('derogationEnd')->nullable()->after('derogationStart');
            $table->date('inductionStart')->nullable()->after('derogationEnd');
            $table->date('inductionEnd')->nullable()->after('inductionStart');
            $table->string('cnssNumber')->nullable()->after('inductionEnd');
            $table->string('payrollNumber')->nullable()->after('cnssNumber');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'contractStart', 'contractEnd', 'medicalVisitStart', 'medicalVisitEnd',
                'derogationStart', 'derogationEnd', 'inductionStart', 'inductionEnd',
                'cnssNumber', 'payrollNumber'
            ]);
        });
    }
};
