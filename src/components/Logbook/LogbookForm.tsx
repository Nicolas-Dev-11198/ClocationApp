import React, { useState } from 'react';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { Logbook, SafetyChecklist, Trip, PIROGUES, LOCATIONS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface LogbookFormProps {
  logbook?: Logbook;
  onSave: (logbook: Omit<Logbook, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const LogbookForm: React.FC<LogbookFormProps> = ({ logbook, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Logbook, 'id' | 'createdAt'>>({
    pirogue: logbook?.pirogue || '',
    pilot: logbook?.pilot || user?.fullName || '',
    copilot: logbook?.copilot || '',
    sailor: logbook?.sailor || '',
    date: logbook?.date || new Date(),
    safetyChecklist: logbook?.safetyChecklist || {
      hullCondition: false,
      roofCondition: false,
      fireExtinguisher: false,
      flare: false,
      flashlight: false,
      firstAidKit: false,
      circuitBreaker: false,
      vhfRadio: false,
      bluRadio: false,
      chekesFilter: false,
      buoyWithRope: false,
      fogRope: false,
      scoop: false,
      pole: false,
      oars: false,
      grapple: false,
      anchor: false,
      garbageBags: false,
      sufficientVests: false,
      signageVisible: false,
      chartsAndProcedures: false,
      spotsOperational: false,
      backupSpots: false,
      toolboxMeeting: false,
      toolboxTheme: ''
    },
    trips: logbook?.trips || [
      {
        id: '1',
        departurePoint: '',
        departureTime: '',
        departureFuel: 0,
        arrivalPoint: '',
        arrivalTime: '',
        arrivalFuel: 0
      }
    ],
    comments: logbook?.comments || '',
    mechanicalIntervention: logbook?.mechanicalIntervention || false,
    pilotValidated: logbook?.pilotValidated || false,
    logisticsValidated: logbook?.logisticsValidated || false
  });

  const safetyChecklistItems = [
    { key: 'hullCondition', label: 'Coque en bon état' },
    { key: 'roofCondition', label: 'Toit en bon état' },
    { key: 'fireExtinguisher', label: 'Extincteur 2kg' },
    { key: 'flare', label: 'Fusée de détresse' },
    { key: 'flashlight', label: 'Lampe torche' },
    { key: 'firstAidKit', label: 'Trousse à pharmacie' },
    { key: 'circuitBreaker', label: 'Coupe circuit' },
    { key: 'vhfRadio', label: 'Radio VHF' },
    { key: 'bluRadio', label: 'Radio BLU' },
    { key: 'chekesFilter', label: 'Filtre Chekes' },
    { key: 'buoyWithRope', label: 'Bouée avec corde de 10m' },
    { key: 'fogRope', label: 'Corde de brume' },
    { key: 'scoop', label: 'Écope' },
    { key: 'pole', label: 'Gaffe' },
    { key: 'oars', label: 'Rames' },
    { key: 'grapple', label: 'Grappin' },
    { key: 'anchor', label: 'Ancre' },
    { key: 'garbageBags', label: 'Sacs poubelles' },
    { key: 'sufficientVests', label: 'Gilets suffisants pour le nombre de passagers' },
    { key: 'signageVisible', label: 'Signalétique visible : "Nbr de pax", "Ne pas fumer", "Gilet obligatoire"' },
    { key: 'chartsAndProcedures', label: 'Cartes et mini procédures' },
    { key: 'spotsOperational', label: 'Spots opérationnels' },
    { key: 'backupSpots', label: 'Spots piles de secours' },
    { key: 'toolboxMeeting', label: 'Toolbox Meeting effectué ?' }
  ];

  const handleChecklistChange = (key: keyof SafetyChecklist, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      safetyChecklist: {
        ...prev.safetyChecklist,
        [key]: value
      }
    }));
  };

  const handleTripChange = (index: number, field: string, value: string | number) => {
    const updatedTrips = [...formData.trips];
    updatedTrips[index] = {
      ...updatedTrips[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, trips: updatedTrips }));
  };

  const addTrip = () => {
    if (formData.trips.length < 4) {
      setFormData(prev => ({
        ...prev,
        trips: [
          ...prev.trips,
          {
            id: Date.now().toString(),
            departurePoint: '',
            departureTime: '',
            departureFuel: 0,
            arrivalPoint: '',
            arrivalTime: '',
            arrivalFuel: 0
          }
        ]
      }));
    }
  };

  const removeTrip = (index: number) => {
    if (formData.trips.length > 1) {
      setFormData(prev => ({
        ...prev,
        trips: prev.trips.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {logbook ? 'Modifier le carnet de bord' : 'Nouveau carnet de bord'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Informations générales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pirogue
            </label>
            <select
              value={formData.pirogue}
              onChange={(e) => setFormData(prev => ({ ...prev, pirogue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            >
              <option value="">Sélectionner une pirogue</option>
              {PIROGUES.map(pirogue => (
                <option key={pirogue} value={pirogue}>{pirogue}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilote
            </label>
            <input
              type="text"
              value={formData.pilot}
              onChange={(e) => setFormData(prev => ({ ...prev, pilot: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            />
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
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matelot
            </label>
            <input
              type="text"
              value={formData.sailor}
              onChange={(e) => setFormData(prev => ({ ...prev, sailor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Check-list sécurité */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Check-list sécurité avant départ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {safetyChecklistItems.map(item => (
              <div key={item.key} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={formData.safetyChecklist[item.key as keyof SafetyChecklist] as boolean}
                  onChange={(e) => handleChecklistChange(item.key as keyof SafetyChecklist, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <label htmlFor={item.key} className="text-sm text-gray-700 leading-5">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {formData.safetyChecklist.toolboxMeeting && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thème du Toolbox Meeting
              </label>
              <input
                type="text"
                value={formData.safetyChecklist.toolboxTheme || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  safetyChecklist: {
                    ...prev.safetyChecklist,
                    toolboxTheme: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Précisez le thème du Toolbox Meeting"
              />
            </div>
          )}
        </div>

        {/* Trajets */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Trajets</h3>
            {formData.trips.length < 4 && (
              <button
                type="button"
                onClick={addTrip}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un trajet</span>
              </button>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {formData.trips.map((trip, index) => (
              <div key={trip.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Trajet {index + 1}</h4>
                  {formData.trips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTrip(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Point de départ
                    </label>
                    <select
                      value={trip.departurePoint}
                      onChange={(e) => handleTripChange(index, 'departurePoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de départ
                    </label>
                    <input
                      type="time"
                      value={trip.departureTime}
                      onChange={(e) => handleTripChange(index, 'departureTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carburant départ (L)
                    </label>
                    <input
                      type="number"
                      value={trip.departureFuel}
                      onChange={(e) => handleTripChange(index, 'departureFuel', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Point d'arrivée
                    </label>
                    <select
                      value={trip.arrivalPoint}
                      onChange={(e) => handleTripChange(index, 'arrivalPoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure d'arrivée
                    </label>
                    <input
                      type="time"
                      value={trip.arrivalTime}
                      onChange={(e) => handleTripChange(index, 'arrivalTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carburant arrivée (L)
                    </label>
                    <input
                      type="number"
                      value={trip.arrivalFuel}
                      onChange={(e) => handleTripChange(index, 'arrivalFuel', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commentaires */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaires
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Commentaires libres du pilote..."
          />
        </div>

        {/* Intervention mécanique */}
        <div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="mechanicalIntervention"
              checked={formData.mechanicalIntervention}
              onChange={(e) => setFormData(prev => ({ ...prev, mechanicalIntervention: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="mechanicalIntervention" className="text-sm font-medium text-gray-700">
              Panne ou besoin d'intervention mécanique
            </label>
          </div>
          {formData.mechanicalIntervention && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Une alerte sera envoyée au mécanicien
              </p>
            </div>
          )}
        </div>

        {/* Validation du pilote */}
        <div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="pilotValidated"
              checked={formData.pilotValidated}
              onChange={(e) => setFormData(prev => ({ ...prev, pilotValidated: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pilotValidated" className="text-sm font-medium text-gray-700">
              Je valide ce carnet de bord
            </label>
          </div>
        </div>

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

export default LogbookForm;