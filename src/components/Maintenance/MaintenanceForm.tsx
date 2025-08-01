import React, { useState } from 'react';
import { Plus, Trash2, Save, CheckCircle, Wrench } from 'lucide-react';
import { MaintenanceSheet, PIROGUES, LOCATIONS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface MaintenanceFormProps {
  maintenanceSheet?: MaintenanceSheet;
  onSave: (sheet: Omit<MaintenanceSheet, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ maintenanceSheet, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<MaintenanceSheet, 'id' | 'createdAt'>>({
    location: maintenanceSheet?.location || '',
    pirogue: maintenanceSheet?.pirogue || '',
    motorBrand: maintenanceSheet?.motorBrand || 'Yamaha',
    equipmentSpecs: maintenanceSheet?.equipmentSpecs || '',
    interventionDate: maintenanceSheet?.interventionDate || new Date(),
    interventionType: maintenanceSheet?.interventionType || 'diagnostic',
    responsiblePilot: maintenanceSheet?.responsiblePilot || '',
    designation: maintenanceSheet?.designation || '',
    reference: maintenanceSheet?.reference || '',
    quantity: maintenanceSheet?.quantity || 1,
    workDescription: maintenanceSheet?.workDescription || '',
    mechanicValidated: maintenanceSheet?.mechanicValidated || false,
    pilotValidated: maintenanceSheet?.pilotValidated || false,
    hseValidated: maintenanceSheet?.hseValidated || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const interventionTypes = [
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'reparation', label: 'Réparation' },
    { value: 'maintenance', label: 'Maintenance préventive' }
  ];

  const motorBrands = [
    { value: 'Yamaha', label: 'Yamaha' },
    { value: 'Suzuki', label: 'Suzuki' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Wrench className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {maintenanceSheet ? 'Modifier la fiche de maintenance' : 'Nouvelle fiche de maintenance'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Informations générales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu d'intervention
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
            >
              <option value="">Sélectionner un lieu</option>
              <option value="Base">Base</option>
              {LOCATIONS.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pirogue
            </label>
            <select
              value={formData.pirogue}
              onChange={(e) => setFormData(prev => ({ ...prev, pirogue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
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
              Marque du moteur
            </label>
            <select
              value={formData.motorBrand}
              onChange={(e) => setFormData(prev => ({ ...prev, motorBrand: e.target.value as 'Yamaha' | 'Suzuki' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
            >
              {motorBrands.map(brand => (
                <option key={brand.value} value={brand.value}>{brand.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'intervention
            </label>
            <input
              type="date"
              value={formData.interventionDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, interventionDate: new Date(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'intervention
            </label>
            <select
              value={formData.interventionType}
              onChange={(e) => setFormData(prev => ({ ...prev, interventionType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
            >
              {interventionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilote responsable
            </label>
            <input
              type="text"
              value={formData.responsiblePilot}
              onChange={(e) => setFormData(prev => ({ ...prev, responsiblePilot: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
              placeholder="Nom du pilote responsable"
            />
          </div>
        </div>

        {/* Caractéristiques de l'équipement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caractéristiques de l'équipement
          </label>
          <textarea
            value={formData.equipmentSpecs}
            onChange={(e) => setFormData(prev => ({ ...prev, equipmentSpecs: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Décrivez les caractéristiques de l'équipement..."
            required
          />
        </div>

        {/* Détails de l'intervention */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Désignation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
              placeholder="Élément réparé/maintenu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
              placeholder="Référence de la pièce"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              required
              min="1"
            />
          </div>
        </div>

        {/* Description des travaux */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description complète des travaux
          </label>
          <textarea
            value={formData.workDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, workDescription: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Décrivez en détail les travaux effectués..."
            required
          />
        </div>

        {/* Validations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Validations</h3>
          
          <div className="space-y-3">
            {user?.role === 'mecanicien' && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="mechanicValidated"
                  checked={formData.mechanicValidated}
                  onChange={(e) => setFormData(prev => ({ ...prev, mechanicValidated: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="mechanicValidated" className="text-sm font-medium text-gray-700">
                  Validation du mécanicien
                </label>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="pilotValidated"
                checked={formData.pilotValidated}
                onChange={(e) => setFormData(prev => ({ ...prev, pilotValidated: e.target.checked }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="pilotValidated" className="text-sm font-medium text-gray-700">
                Validation du pilote concerné
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hseValidated"
                checked={formData.hseValidated}
                onChange={(e) => setFormData(prev => ({ ...prev, hseValidated: e.target.checked }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="hseValidated" className="text-sm font-medium text-gray-700">
                Validation HSE
              </label>
            </div>
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
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;