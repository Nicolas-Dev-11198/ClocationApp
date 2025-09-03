<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Logbook extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'booking_id',
        'pirogue',
        'pilot',
        'copilot',
        'sailor',
        'date',
        'safetyChecklist',
        'trips',
        'comments',
        'mechanicalIntervention',
        'pilotValidated',
        'logisticsValidated',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'safetyChecklist' => 'array',
            'trips' => 'array',
            'mechanicalIntervention' => 'boolean',
            'pilotValidated' => 'boolean',
            'logisticsValidated' => 'boolean',
        ];
    }

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
