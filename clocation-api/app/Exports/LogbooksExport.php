<?php

namespace App\Exports;

use App\Models\Logbook;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LogbooksExport implements FromCollection, WithHeadings, WithMapping
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
        $query = Logbook::with(['user', 'booking']);
        
        if (isset($this->filters['start_date'])) {
            $query->where('date', '>=', $this->filters['start_date']);
        }
        
        if (isset($this->filters['end_date'])) {
            $query->where('date', '<=', $this->filters['end_date']);
        }
        
        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (isset($this->filters['vehicle_id'])) {
            $query->where('vehicleId', $this->filters['vehicle_id']);
        }
        
        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Utilisateur',
            'Réservation ID',
            'ID Véhicule',
            'Date',
            'Heure de départ',
            'Heure d\'arrivée',
            'Km début',
            'Km fin',
            'Destination',
            'Objectif',
            'Observations',
            'Statut',
            'Créé le'
        ];
    }

    public function map($logbook): array
    {
        return [
            $logbook->id,
            $logbook->user ? $logbook->user->name : 'N/A',
            $logbook->booking_id,
            $logbook->vehicleId,
            $logbook->date,
            $logbook->departureTime,
            $logbook->arrivalTime,
            $logbook->startKm,
            $logbook->endKm,
            $logbook->destination,
            $logbook->purpose,
            $logbook->observations,
            $logbook->status,
            $logbook->created_at->format('Y-m-d H:i:s')
        ];
    }
}
