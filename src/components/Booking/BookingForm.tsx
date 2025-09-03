import React, { useState, useEffect } from 'react';
import { Save, Calendar, Users, MapPin, Package, AlertTriangle } from 'lucide-react';
import { Booking } from '../../types/api';
import { Booking as UIBooking } from '../../types';
import { configServiceInstance } from '../../services/configService';

interface BookingFormProps {
  booking?: UIBooking;
  onSave: (booking: Omit<UIBooking, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ booking, onSave, onCancel }) => {
  const [pirogues, setPirogues] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<Array<{value: string, label: string, color: string}>>([]);
  const [formData, setFormData] = useState<Omit<UIBooking, 'id' | 'createdAt'>>({
    scheduledDate: booking?.scheduledDate || new Date(),
    pirogue: booking?.pirogue || '',
    pilot: booking?.pilot || '',
    copilot: booking?.copilot || '',
    sailor: booking?.sailor || '',
    passengerCount: booking?.passengerCount || 1,
    departurePoint: booking?.departurePoint || '',
    arrivalPoint: booking?.arrivalPoint || '',
    baggageWeight: booking?.baggageWeight || 0,
    priority: booking?.priority || 'Moyenne',
    requesterName: booking?.requesterName || '',
    requesterCompany: booking?.requesterCompany || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [piroguesData, locationsData, priorityOptionsData] = await Promise.all([
          configServiceInstance.getPirogues(),
          configServiceInstance.getLocations(),
          configServiceInstance.getPriorityOptions()
        ]);
        setPirogues(piroguesData);
        setLocations(locationsData);
        setPriorityOptions(priorityOptionsData);
      } catch (error) {
        console.error('Error loading config data:', error);
      }
    };

    loadConfig();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'La date est obligatoire';
    }

    if (!formData.pirogue) {
      newErrors.pirogue = 'La pirogue est obligatoire';
    }

    if (!formData.pilot) {
      newErrors.pilot = 'Le pilote est obligatoire';
    }

    if (!formData.departurePoint) {
      newErrors.departurePoint = 'Le point de départ est obligatoire';
    }

    if (!formData.arrivalPoint) {
      newErrors.arrivalPoint = 'Le point d\'arrivée est obligatoire';
    }

    if (formData.departurePoint === formData.arrivalPoint) {
      newErrors.arrivalPoint = 'Le point d\'arrivée doit être différent du point de départ';
    }

    if (formData.passengerCount < 1) {
      newErrors.passengerCount = 'Le nombre de passagers doit être au moins 1';
    }

    if (!formData.requesterName) {
      newErrors.requesterName = 'Le nom du demandeur est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };



  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {booking ? 'Modifier le booking' : 'Nouveau booking'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Informations générales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date prévue *
            </label>
            <input
              type="date"
              value={formData.scheduledDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: new Date(e.target.value) }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.scheduledDate && (
              <p className="text-red-600 text-xs mt-1">{errors.scheduledDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pirogue *
            </label>
            <select
              value={formData.pirogue}
              onChange={(e) => setFormData(prev => ({ ...prev, pirogue: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.pirogue ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option key="select-pirogue" value="">Sélectionner une pirogue</option>
              {pirogues.map(pirogue => (
                <option key={pirogue} value={pirogue}>{pirogue}</option>
              ))}
            </select>
            {errors.pirogue && (
              <p className="text-red-600 text-xs mt-1">{errors.pirogue}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'Haute' | 'Moyenne' | 'Basse' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Nombre de passagers *
            </label>
            <input
              type="number"
              value={formData.passengerCount}
              onChange={(e) => setFormData(prev => ({ ...prev, passengerCount: parseInt(e.target.value) || 1 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.passengerCount ? 'border-red-300' : 'border-gray-300'
              }`}
              required
              min="1"
              max="20"
            />
            {errors.passengerCount && (
              <p className="text-red-600 text-xs mt-1">{errors.passengerCount}</p>
            )}
          </div>
        </div>

        {/* Équipage */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilote *
              </label>
              <input
                type="text"
                value={formData.pilot}
                onChange={(e) => setFormData(prev => ({ ...prev, pilot: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.pilot ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                placeholder="Nom du pilote"
              />
              {errors.pilot && (
                <p className="text-red-600 text-xs mt-1">{errors.pilot}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copilote
              </label>
              <input
                type="text"
                value={formData.copilot}
                onChange={(e) => setFormData(prev => ({ ...prev, copilot: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Nom du copilote (optionnel)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matelot
              </label>
              <input
                type="text"
                value={formData.sailor}
                onChange={(e) => setFormData(prev => ({ ...prev, sailor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Nom du matelot (optionnel)"
              />
            </div>
          </div>
        </div>

        {/* Trajet */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <MapPin className="h-5 w-5 inline mr-2" />
            Trajet
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point de départ *
              </label>
              <select
                value={formData.departurePoint}
                onChange={(e) => setFormData(prev => ({ ...prev, departurePoint: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.departurePoint ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option key="select-departure" value="">Sélectionner le point de départ</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.departurePoint && (
                <p className="text-red-600 text-xs mt-1">{errors.departurePoint}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point d'arrivée *
              </label>
              <select
                value={formData.arrivalPoint}
                onChange={(e) => setFormData(prev => ({ ...prev, arrivalPoint: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.arrivalPoint ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option key="select-arrival" value="">Sélectionner le point d'arrivée</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.arrivalPoint && (
                <p className="text-red-600 text-xs mt-1">{errors.arrivalPoint}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-1" />
              Poids des bagages (kg)
            </label>
            <input
              type="number"
              value={formData.baggageWeight}
              onChange={(e) => setFormData(prev => ({ ...prev, baggageWeight: parseFloat(e.target.value) || 0 }))}
              className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              min="0"
              step="0.1"
              placeholder="0"
            />
          </div>
        </div>

        {/* Demandeur */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandeur</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du demandeur *
              </label>
              <input
                type="text"
                value={formData.requesterName}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.requesterName ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                placeholder="Nom de la personne qui demande le transport"
              />
              {errors.requesterName && (
                <p className="text-red-600 text-xs mt-1">{errors.requesterName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise du demandeur
              </label>
              <input
                type="text"
                value={formData.requesterCompany}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterCompany: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Ex: Christelle Iromba (pour bookings internes)"
              />
            </div>
          </div>
        </div>

        {/* Validation des données */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-2">Erreurs de validation</h3>
                <p className="text-sm text-red-700">
                  Veuillez corriger les erreurs ci-dessus avant de continuer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;