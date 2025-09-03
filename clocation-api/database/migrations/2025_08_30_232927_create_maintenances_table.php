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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->string('pirogue');
            $table->enum('motorBrand', ['Yamaha', 'Suzuki']);
            $table->string('equipmentSpecs');
            $table->date('interventionDate');
            $table->enum('interventionType', ['diagnostic', 'reparation', 'maintenance']);
            $table->string('responsiblePilot');
            $table->string('designation');
            $table->string('reference');
            $table->integer('quantity');
            $table->text('workDescription');
            $table->boolean('mechanicValidated')->default(false);
            $table->boolean('pilotValidated')->default(false);
            $table->boolean('hseValidated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
