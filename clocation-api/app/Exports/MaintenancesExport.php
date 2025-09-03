<?php

namespace App\Exports;

use App\Models\Maintenance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MaintenancesExport implements FromCollection, WithHeadings, WithMapping
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
        $query = Maintenance::with('user');
        
        if (isset($this->filters['start_date'])) {
            $query->where('scheduledDate', '>=', $this->filters['start_date']);
        }
        
        if (isset($this->filters['end_date'])) {
            $query->where('scheduledDate', '<=', $this->filters['end_date']);
        }
        
        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (isset($this->filters['vehicle_id'])) {
            $query->where('vehicleId', $this->filters['vehicle_id']);
        }
        
        if (isset($this->filters['type'])) {
            $query->where('type', $this->filters['type']);
        }
        
        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Utilisateur',
            'ID Véhicule',
            'Type',
            'Description',
            'Date programmée',
            'Date de réalisation',
            'Coût',
            'Statut',
            'Notes',
            'Créé le'
        ];
    }

    public function map($maintenance): array
    {
        return [
            $maintenance->id,
            $maintenance->user ? $maintenance->user->name : 'N/A',
            $maintenance->vehicleId,
            $maintenance->type,
            $maintenance->description,
            $maintenance->scheduledDate,
            $maintenance->completedDate,
            $maintenance->cost,
            $maintenance->status,
            $maintenance->notes,
            $maintenance->created_at->format('Y-m-d H:i:s')
        ];
    }
}
