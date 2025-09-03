<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\BookingsExport;
use App\Exports\LogbooksExport;
use App\Exports\MaintenancesExport;
use App\Exports\UsersExport;
use App\Models\Booking;
use App\Models\Logbook;
use App\Models\Maintenance;
use App\Models\User;

class ExportController extends Controller
{
    public function exportBookings(Request $request)
    {
        $format = $request->get('format', 'excel');
        $filters = $request->only(['start_date', 'end_date', 'status', 'vehicle_type']);
        
        if ($format === 'pdf') {
            return $this->exportBookingsPDF($filters);
        }
        
        return Excel::download(new BookingsExport($filters), 'reservations.xlsx');
    }
    
    public function exportLogbooks(Request $request)
    {
        $format = $request->get('format', 'excel');
        $filters = $request->only(['start_date', 'end_date', 'status', 'vehicle_id']);
        
        if ($format === 'pdf') {
            return $this->exportLogbooksPDF($filters);
        }
        
        return Excel::download(new LogbooksExport($filters), 'carnets_de_bord.xlsx');
    }
    
    public function exportMaintenances(Request $request)
    {
        $format = $request->get('format', 'excel');
        $filters = $request->only(['start_date', 'end_date', 'status', 'vehicle_id', 'type']);
        
        if ($format === 'pdf') {
            return $this->exportMaintenancesPDF($filters);
        }
        
        return Excel::download(new MaintenancesExport($filters), 'maintenances.xlsx');
    }
    
    public function exportUsers(Request $request)
    {
        $format = $request->get('format', 'excel');
        $filters = $request->only(['role', 'status', 'department']);
        
        if ($format === 'pdf') {
            return $this->exportUsersPDF($filters);
        }
        
        return Excel::download(new UsersExport($filters), 'utilisateurs.xlsx');
    }
    
    private function exportBookingsPDF($filters)
    {
        $query = Booking::with('user');
        
        if (isset($filters['start_date'])) {
            $query->where('startDate', '>=', $filters['start_date']);
        }
        
        if (isset($filters['end_date'])) {
            $query->where('endDate', '<=', $filters['end_date']);
        }
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['vehicle_type'])) {
            $query->where('vehicleType', $filters['vehicle_type']);
        }
        
        $bookings = $query->get();
        
        $pdf = Pdf::loadView('exports.bookings', compact('bookings'));
        return $pdf->download('reservations.pdf');
    }
    
    private function exportLogbooksPDF($filters)
    {
        $query = Logbook::with(['user', 'booking']);
        
        if (isset($filters['start_date'])) {
            $query->where('date', '>=', $filters['start_date']);
        }
        
        if (isset($filters['end_date'])) {
            $query->where('date', '<=', $filters['end_date']);
        }
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['vehicle_id'])) {
            $query->where('vehicleId', $filters['vehicle_id']);
        }
        
        $logbooks = $query->get();
        
        $pdf = Pdf::loadView('exports.logbooks', compact('logbooks'));
        return $pdf->download('carnets_de_bord.pdf');
    }
    
    private function exportMaintenancesPDF($filters)
    {
        $query = Maintenance::with('user');
        
        if (isset($filters['start_date'])) {
            $query->where('scheduledDate', '>=', $filters['start_date']);
        }
        
        if (isset($filters['end_date'])) {
            $query->where('scheduledDate', '<=', $filters['end_date']);
        }
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['vehicle_id'])) {
            $query->where('vehicleId', $filters['vehicle_id']);
        }
        
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        $maintenances = $query->get();
        
        $pdf = Pdf::loadView('exports.maintenances', compact('maintenances'));
        return $pdf->download('maintenances.pdf');
    }
    
    private function exportUsersPDF($filters)
    {
        $query = User::query();
        
        if (isset($filters['role'])) {
            $query->where('role', $filters['role']);
        }
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['department'])) {
            $query->where('department', $filters['department']);
        }
        
        $users = $query->get();
        
        $pdf = Pdf::loadView('exports.users', compact('users'));
        return $pdf->download('utilisateurs.pdf');
    }
    
    public function exportSingleLogbook($id)
    {
        $logbook = Logbook::with(['user', 'booking'])->findOrFail($id);
        
        $pdf = Pdf::loadView('exports.single-logbook', compact('logbook'));
        return $pdf->download('carnet_de_bord_' . $logbook->id . '.pdf');
    }
    
    public function exportSingleMaintenance($id)
    {
        $maintenance = Maintenance::with('user')->findOrFail($id);
        
        $pdf = Pdf::loadView('exports.single-maintenance', compact('maintenance'));
        return $pdf->download('maintenance_' . $maintenance->id . '.pdf');
    }
}
