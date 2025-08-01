import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2,
  Upload
} from 'lucide-react';
import { Booking, PIROGUES } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface BookingListProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onNew: () => void;
  onDelete: (bookingId: string) => void;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, onEdit, onNew, onDelete }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Haute' | 'Moyenne' | 'Basse'>('all');
  const [selectedPirogue, setSelectedPirogue] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-100 text-red-700';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-700';
      case 'Basse':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDateStatus = (date: Date) => {
    const today = new Date();
    const bookingDate = new Date(date);
    
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (bookingDate.getTime() === today.getTime()) {
      return { status: 'today', label: 'Aujourd\'hui', color: 'text-blue-600' };
    } else if (bookingDate > today) {
      return { status: 'upcoming', label: 'À venir', color: 'text-green-600' };
    } else {
      return { status: 'past', label: 'Passé', color: 'text-gray-500' };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const dateStatus = getDateStatus(booking.scheduledDate);
    
    const matchesDateFilter = (() => {
      switch (filter) {
        case 'today':
          return dateStatus.status === 'today';
        case 'upcoming':
          return dateStatus.status === 'upcoming';
        case 'past':
          return dateStatus.status === 'past';
        default:
          return true;
      }
    })();

    const matchesPriorityFilter = priorityFilter === 'all' || booking.priority === priorityFilter;
    const matchesPirogueFilter = selectedPirogue === 'all' || booking.pirogue === selectedPirogue;

    return matchesDateFilter && matchesPriorityFilter && matchesPirogueFilter;
  });

  const sortedBookings = filteredBookings.sort((a, b) => {
    // Sort by date first, then by priority
    const dateCompare = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    
    const priorityOrder = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const exportToPDF = () => {
    alert('Export PDF - Fonctionnalité à implémenter avec une librairie PDF');
  };

  const exportToExcel = () => {
    alert('Export Excel - Fonctionnalité à implémenter avec une librairie Excel');
  };

  const handleImport = () => {
    alert('Import de booking externe - Fonctionnalité à implémenter');
  };

  const handleDelete = (booking: Booking) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le booking du ${booking.scheduledDate.toLocaleDateString('fr-FR')} ?`)) {
      onDelete(booking.id);
    }
  };

  if (user?.role !== 'responsable_logistique' && user?.role !== 'directeur') {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
        <p className="text-gray-500">
          Seuls les responsables logistiques peuvent gérer les bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Planification des trajets</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleImport}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Upload className="h-4 w-4" />
            <span>Importer</span>
          </button>
          <button
            onClick={onNew}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau booking</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Tous</option>
              <option value="today">Aujourd'hui</option>
              <option value="upcoming">À venir</option>
              <option value="past">Passés</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Toutes</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pirogue
            </label>
            <select
              value={selectedPirogue}
              onChange={(e) => setSelectedPirogue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Toutes</option>
              {PIROGUES.map(pirogue => (
                <option key={pirogue} value={pirogue}>{pirogue}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={exportToPDF}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {sortedBookings.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <Calendar className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun booking</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Commencez par créer votre premier booking</p>
            <button
              onClick={onNew}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau booking</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile view */}
            <div className="block sm:hidden">
              {sortedBookings.map((booking) => {
                const dateStatus = getDateStatus(booking.scheduledDate);
                return (
                  <div key={booking.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{booking.pirogue}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(booking.priority)}`}>
                            {booking.priority}
                          </span>
                        </div>
                        <p className={`text-sm ${dateStatus.color}`}>
                          {booking.scheduledDate.toLocaleDateString('fr-FR')} - {dateStatus.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.departurePoint} → {booking.arrivalPoint}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3 space-y-1">
                      <p className="text-sm text-gray-600">
                        <Users className="h-3 w-3 inline mr-1" />
                        {booking.passengerCount} passagers
                      </p>
                      <p className="text-sm text-gray-600">Pilote: {booking.pilot}</p>
                      <p className="text-sm text-gray-600">Demandeur: {booking.requesterName}</p>
                      {booking.requesterCompany && (
                        <p className="text-sm text-gray-600">Entreprise: {booking.requesterCompany}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Créé le {booking.createdAt.toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit(booking)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-sm">
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop view */}
            <table className="w-full hidden sm:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pirogue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Équipage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAX
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demandeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBookings.map((booking) => {
                  const dateStatus = getDateStatus(booking.scheduledDate);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.scheduledDate.toLocaleDateString('fr-FR')}
                          </div>
                          <div className={`text-xs ${dateStatus.color}`}>
                            {dateStatus.label}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.pirogue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {booking.departurePoint} → {booking.arrivalPoint}
                        </div>
                        {booking.baggageWeight > 0 && (
                          <div className="text-xs text-gray-500">
                            Bagages: {booking.baggageWeight}kg
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Pilote: {booking.pilot}
                        </div>
                        {booking.copilot && (
                          <div className="text-xs text-gray-500">
                            Copilote: {booking.copilot}
                          </div>
                        )}
                        {booking.sailor && (
                          <div className="text-xs text-gray-500">
                            Matelot: {booking.sailor}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="h-4 w-4 mr-1" />
                          {booking.passengerCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(booking.priority)}`}>
                          {booking.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.requesterName}</div>
                        {booking.requesterCompany && (
                          <div className="text-xs text-gray-500">{booking.requesterCompany}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEdit(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            title="Exporter"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;