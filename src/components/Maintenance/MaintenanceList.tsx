import React, { useState } from 'react';
import { Plus, Edit, FileText, CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { MaintenanceSheet } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface MaintenanceListProps {
  maintenanceSheets: MaintenanceSheet[];
  onEdit: (sheet: MaintenanceSheet) => void;
  onNew: () => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenanceSheets, onEdit, onNew }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');

  const getStatusIcon = (sheet: MaintenanceSheet) => {
    if (sheet.mechanicValidated && sheet.pilotValidated && sheet.hseValidated) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (sheet.mechanicValidated) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (sheet: MaintenanceSheet) => {
    if (sheet.mechanicValidated && sheet.pilotValidated && sheet.hseValidated) {
      return 'Validé';
    } else if (sheet.mechanicValidated) {
      return 'En attente validation';
    } else {
      return 'En cours';
    }
  };

  const getInterventionTypeLabel = (type: string) => {
    const labels = {
      diagnostic: 'Diagnostic',
      reparation: 'Réparation',
      maintenance: 'Maintenance'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredSheets = maintenanceSheets.filter(sheet => {
    if (filter === 'pending') {
      return !sheet.mechanicValidated || !sheet.pilotValidated || !sheet.hseValidated;
    } else if (filter === 'validated') {
      return sheet.mechanicValidated && sheet.pilotValidated && sheet.hseValidated;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fiches de maintenance</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez les interventions de maintenance</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle fiche</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('validated')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            filter === 'validated'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Validées
        </button>
      </div>

      {/* Liste des fiches */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredSheets.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <Wrench className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucune fiche de maintenance</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Commencez par créer votre première fiche de maintenance</p>
            <button
              onClick={onNew}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle fiche</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile view */}
            <div className="block sm:hidden">
              {filteredSheets.map((sheet) => (
                <div key={sheet.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{sheet.pirogue}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {getInterventionTypeLabel(sheet.interventionType)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{sheet.interventionDate.toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600">{sheet.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(sheet)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-medium">{sheet.designation}</p>
                    <p className="text-xs text-gray-500">Pilote: {sheet.responsiblePilot}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getStatusText(sheet)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(sheet)}
                        className="text-orange-600 hover:text-orange-900 flex items-center space-x-1 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </button>
                      <button className="text-green-600 hover:text-green-900 flex items-center space-x-1 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pilote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSheets.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sheet.interventionDate.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sheet.pirogue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getInterventionTypeLabel(sheet.interventionType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sheet.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sheet.responsiblePilot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(sheet)}
                        <span className="text-sm text-gray-900">
                          {getStatusText(sheet)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit(sheet)}
                          className="text-orange-600 hover:text-orange-900 flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;