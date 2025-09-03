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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('scheduledDate');
            $table->string('pirogue');
            $table->string('pilot');
            $table->string('copilot')->nullable();
            $table->string('sailor')->nullable();
            $table->integer('passengerCount');
            $table->string('departurePoint');
            $table->string('arrivalPoint');
            $table->decimal('baggageWeight', 8, 2);
            $table->enum('priority', ['Haute', 'Moyenne', 'Basse']);
            $table->string('requesterName');
            $table->string('requesterCompany');
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
