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
        Schema::create('logbooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->string('pirogue');
            $table->string('pilot');
            $table->string('copilot')->nullable();
            $table->string('sailor')->nullable();
            $table->date('date');
            $table->json('safetyChecklist');
            $table->json('trips');
            $table->text('comments')->nullable();
            $table->boolean('mechanicalIntervention')->default(false);
            $table->boolean('pilotValidated')->default(false);
            $table->boolean('logisticsValidated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logbooks');
    }
};
