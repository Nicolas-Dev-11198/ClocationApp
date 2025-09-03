import React, { useState, useEffect } from 'react';
import { Booking, BookingFilters } from '../../types/api';
import { Booking as UIBooking } from '../../types';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import { bookingService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AccessDenied } from '../Common/PermissionGuard';
import Pagination, { PaginationInfo } from '../common/Pagination';

// Fonction pour convertir Booking (API) vers UIBooking (UI)
const mapApiBookingToUI = (apiBooking: Booking): UIBooking => ({
  id: apiBooking.id ? apiBooking.id.toString() : `temp-${Date.now()}-${Math.random()}`,
  scheduledDate: apiBooking.scheduledDate ? new Date(apiBooking.scheduledDate) : new Date(),
  pirogue: apiBooking.pirogue,
  pilot: apiBooking.pilot,
  copilot: apiBooking.copilot || '',
  sailor: apiBooking.sailor || '',
  passengerCount: apiBooking.passengerCount,
  departurePoint: apiBooking.departurePoint,
  arrivalPoint: apiBooking.arrivalPoint,
  baggageWeight: apiBooking.baggageWeight || 0,
  priority: apiBooking.priority || 'Moyenne',
  requesterName: apiBooking.requesterName || '',
  requesterCompany: apiBooking.requesterCompany || '',
  createdAt: apiBooking.created_at ? new Date(apiBooking.created_at) : new Date()
});

// Fonction pour convertir UIBooking vers BookingData (API)
const mapUIBookingToApi = (uiBooking: Omit<UIBooking, 'id' | 'createdAt'>) => ({
  scheduledDate: uiBooking.scheduledDate.toISOString().split('T')[0], // Format YYYY-MM-DD
  pirogue: uiBooking.pirogue,
  pilot: uiBooking.pilot,
  copilot: uiBooking.copilot || null,
  sailor: uiBooking.sailor || null,
  passengerCount: uiBooking.passengerCount,
  departurePoint: uiBooking.departurePoint,
  arrivalPoint: uiBooking.arrivalPoint,
  baggageWeight: uiBooking.baggageWeight,
  priority: uiBooking.priority,
  requesterName: uiBooking.requesterName,
  requesterCompany: uiBooking.requesterCompany,
  status: 'pending'
});

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<UIBooking[]>([]);
  const [editingBooking, setEditingBooking] = useState<UIBooking | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0
  });
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    per_page: 5
  });
  const { showToast } = useToast();
  const permissions = usePermissions();

  // Check permissions
  if (!permissions.canManageBookings) {
    return <AccessDenied />;
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    loadBookings(newFilters);
  };

  const handlePerPageChange = (perPage: number) => {
    const newFilters = { ...filters, per_page: perPage, page: 1 };
    setFilters(newFilters);
    loadBookings(newFilters);
  };

  const loadBookings = async (newFilters?: BookingFilters) => {
    try {
      setLoading(true);
      const currentFilters = newFilters || filters;
      const response = await bookingService.getAll(currentFilters);
      const uiBookings = response.data.map(mapApiBookingToUI);
      setBookings(uiBookings);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to
      });
    } catch (error) {
      console.error('Failed to load bookings:', error);
      showToast('error', 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (bookingData: Omit<UIBooking, 'id' | 'createdAt'>) => {
    if (!permissions.canManageBookings) return;
    try {
      // Convert UI booking data to API format
      const apiBookingData = mapUIBookingToApi(bookingData);

      if (editingBooking) {
        // Update existing booking
        await bookingService.updateBooking(parseInt(editingBooking.id), apiBookingData);
        showToast('success', 'Réservation modifiée avec succès');
      } else {
        // Create new booking
        await bookingService.createBooking(apiBookingData);
        showToast('success', 'Réservation créée avec succès');
      }
      
      // Reload bookings to get updated data
      await loadBookings();
      setEditingBooking(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save booking:', error);
      showToast('error', 'Erreur lors de l\'enregistrement de la réservation');
    }
  };

  const handleEdit = (booking: UIBooking) => {
    if (!permissions.canManageBookings) return;
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleNew = () => {
    if (!permissions.canManageBookings) return;
    setEditingBooking(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingBooking(null);
    setShowForm(false);
  };

  const handleDelete = async (bookingId: string) => {
    if (!permissions.canManageBookings) return;
    try {
      await bookingService.deleteBooking(parseInt(bookingId));
      showToast('success', 'Réservation supprimée avec succès');
      await loadBookings();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      showToast('error', 'Erreur lors de la suppression de la réservation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des réservations...</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <BookingForm
        booking={editingBooking || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <BookingList
        bookings={bookings}
        onEdit={handleEdit}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      />
    </div>
  );
};

export default BookingManager;