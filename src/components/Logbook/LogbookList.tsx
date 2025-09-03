import React, { useState } from 'react';
import { Plus, Edit, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Logbook as UILogbook } from '../../types';
import ExportButton from '../ExportButton';
import { usePermissions } from '../../hooks/usePermissions';
import { reportService } from '../../services/api';
import { downloadFile, getExportFilename, handleExportError } from '../../utils/downloadUtils';

interface LogbookListProps {
  logbooks: UILogbook[];
  onEdit: (logbook: UILogbook) => void;
  onNew: () => void;
}

const LogbookList: React.FC<LogbookListProps> = ({ logbooks, onEdit, onNew }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const permissions = usePermissions();

  const handleExportPDF = async (logbookId: number) => {
    try {
      const blob = await reportService.exportSingleLogbook(logbookId);
      const filename = `carnet_de_bord_${logbookId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      downloadFile(blob, filename);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const getStatusIcon = (logbook: UILogbook) => {
    if (logbook.pilotValidated && logbook.logisticsValidated) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (logbook.pilotValidated) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (logbook: UILogbook) => {
    if (logbook.pilotValidated && logbook.logisticsValidated) {
      return 'Validé';
    } else if (logbook.pilotValidated) {
      return 'En attente logistique';
    } else {
      return 'En attente pilote';
    }
  };

  const filteredLogbooks = logbooks.filter(logbook => {
    if (filter === 'pending') {
      return !logbook.pilotValidated || !logbook.logisticsValidated;
    } else if (filter === 'validated') {
      return logbook.pilotValidated && logbook.logisticsValidated;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Carnets de bord</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez les carnets de bord journaliers</p>
        </div>
        <div className="flex items-center space-x-2">
          <ExportButton 
            type="logbooks" 
            filters={{
              status: filter !== 'all' ? filter : undefined
            }}
            className="text-sm"
          >
            Exporter
          </ExportButton>
          {permissions.canFillLogbook && (
            <button
              onClick={onNew}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau carnet</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tous
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
          Validés
        </button>
      </div>

      {/* Liste des carnets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredLogbooks.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <FileText className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun carnet de bord</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Commencez par créer votre premier carnet de bord</p>
            <button
              onClick={onNew}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau carnet</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile view */}
            <div className="block sm:hidden">
              {filteredLogbooks.map((logbook) => (
                <div key={logbook.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{logbook.pirogue}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {logbook.trips.length} trajet{logbook.trips.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{logbook.date.toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600">Pilote: {logbook.pilot}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(logbook)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getStatusText(logbook)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {permissions.canFillLogbook && (
                        <button
                          onClick={() => onEdit(logbook)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                      )}
                      <button 
                        onClick={() => handleExportPDF(logbook.id)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1 text-sm"
                      >
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
                    Pilote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajets
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
                {filteredLogbooks.map((logbook) => (
                  <tr key={logbook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {logbook.date.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {logbook.pirogue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {logbook.pilot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {logbook.trips.length} trajet{logbook.trips.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(logbook)}
                        <span className="text-sm text-gray-900">
                          {getStatusText(logbook)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {permissions.canFillLogbook && (
                          <button
                            onClick={() => onEdit(logbook)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleExportPDF(logbook.id)}
                          className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                        >
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

export default LogbookList;