<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
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
        $query = User::query();
        
        if (isset($this->filters['role'])) {
            $query->where('role', $this->filters['role']);
        }
        
        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (isset($this->filters['department'])) {
            $query->where('department', $this->filters['department']);
        }
        
        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nom',
            'Email',
            'Rôle',
            'Département',
            'Position',
            'Téléphone',
            'Statut',
            'Créé le'
        ];
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->firstName . ' ' . $user->lastName,
            $user->email,
            $user->role,
            $user->department,
            $user->position,
            $user->phone,
            $user->status,
            $user->created_at->format('Y-m-d H:i:s')
        ];
    }
}
