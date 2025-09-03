<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'scheduledDate',
        'pirogue',
        'pilot',
        'copilot',
        'sailor',
        'passengerCount',
        'departurePoint',
        'arrivalPoint',
        'baggageWeight',
        'priority',
        'requesterName',
        'requesterCompany',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'scheduledDate' => 'date',
            'passengerCount' => 'integer',
            'baggageWeight' => 'decimal:2',
        ];
    }

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }
}
