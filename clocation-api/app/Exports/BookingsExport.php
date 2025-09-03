<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $query = Booking::with('user');
        
        if (isset($this->filters['start_date'])) {
            $query->where('startDate', '>=', $this->filters['start_date']);
        }
        
        if (isset($this->filters['end_date'])) {
            $query->where('endDate', '<=', $this->filters['end_date']);
        }
        
        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (isset($this->filters['vehicle_type'])) {
            $query->where('vehicleType', $this->filters['vehicle_type']);
        }
        
        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Utilisateur',
            'Type de véhicule',
            'ID Véhicule',
            'Date de début',
            'Date de fin',
            'Heure de début',
            'Heure de fin',
            'Objectif',
            'Destination',
            'Statut',
            'Notes',
            'Créé le'
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->user ? $booking->user->name : 'N/A',
            $booking->vehicleType,
            $booking->vehicleId,
            $booking->startDate,
            $booking->endDate,
            $booking->startTime,
            $booking->endTime,
            $booking->purpose,
            $booking->destination,
            $booking->status,
            $booking->notes,
            $booking->created_at->format('Y-m-d H:i:s')
        ];
    }
}
