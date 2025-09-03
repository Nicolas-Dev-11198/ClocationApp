<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'location',
        'pirogue',
        'motorBrand',
        'equipmentSpecs',
        'interventionDate',
        'interventionType',
        'responsiblePilot',
        'designation',
        'reference',
        'quantity',
        'workDescription',
        'mechanicValidated',
        'pilotValidated',
        'hseValidated',
        'validation_comments',
    ];

    protected function casts(): array
    {
        return [
            'interventionDate' => 'date',
            'quantity' => 'integer',
            'mechanicValidated' => 'boolean',
            'pilotValidated' => 'boolean',
            'hseValidated' => 'boolean',
        ];
    }
}
