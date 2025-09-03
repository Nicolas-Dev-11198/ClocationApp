import React, { useState, useEffect } from 'react';
import { Clock, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { maintenanceValidationService } from '../../services/maintenanceValidationService';
import { usePermissions, useRoleCheck } from '../../hooks/usePermissions';
import { useToast } from '../../contexts/ToastContext';
import { MaintenanceValidation } from './MaintenanceValidation';

interface MaintenanceItem {
  id: string;
  pirogue: string;
  mechanic: string;
  date: string;
  description: string;
  mechanicValidated: boolean;
  pilotValidated: boolean;
  hseValidated: boolean;
  status: string;
  createdAt: string;
}

export const PendingMaintenanceList: React.FC = () => {
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(null);
  const { canValidateMaintenance } = usePermissions();
  const { isPilote, isDirecteur, isLogisticien } = useRoleCheck();
  const { showToast } = useToast();

  useEffect(() => {
    if (canValidateMaintenance) {
      loadPendingMaintenances();
    }
  }, [canValidateMaintenance]);

  const loadPendingMaintenances = async () => {
    try {
      setLoading(true);
      const data = await maintenanceValidationService.getPendingMaintenances();
      // S'assurer que data est un tableau
      setMaintenances(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast('error', 'Erreur', error.message || 'Erreur lors du chargement des rapports en attente');
      setMaintenances([]); // Réinitialiser à un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const getValidationStatus = (maintenance: MaintenanceItem) => {
    const statuses = [];
    
    if (maintenance.mechanicValidated) {
      statuses.push({ label: 'Mécanicien', validated: true });
    }
    if (maintenance.pilotValidated) {
      statuses.push({ label: 'Pilote', validated: true });
    }
    if (maintenance.hseValidated) {
      statuses.push({ label: 'HSE/Admin', validated: true });
    }

    return statuses;
  };

  const needsUserValidation = (maintenance: MaintenanceItem) => {
    if (isPilote && !maintenance.pilotValidated) return true;
    if ((isDirecteur || isLogisticien) && !maintenance.hseValidated) return true;
    return false;
  };

  const filteredMaintenances = Array.isArray(maintenances) ? maintenances.filter(maintenance => {
    // Afficher seulement les rapports qui nécessitent une validation de l'utilisateur actuel
    // ou tous les rapports pour les directeurs/logisticiens
    if (isDirecteur || isLogisticien) {
      return true; // Ils peuvent voir tous les rapports
    }
    return needsUserValidation(maintenance);
  }) : [];

  if (!canValidateMaintenance) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-center text-gray-500">
            Vous n'avez pas les permissions pour valider les rapports de maintenance
          </div>
        </div>
      </div>
    );
  }

  if (selectedMaintenance) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedMaintenance(null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Retour à la liste
        </button>
        <MaintenanceValidation 
          maintenanceId={selectedMaintenance}
          onValidationComplete={() => {
            setSelectedMaintenance(null);
            loadPendingMaintenances();
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Rapports de Maintenance en Attente
        </h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredMaintenances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>Aucun rapport de maintenance en attente de validation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMaintenances.map((maintenance) => {
              const validationStatuses = getValidationStatus(maintenance);
              const needsValidation = needsUserValidation(maintenance);
              
              return (
                <div 
                  key={maintenance.id} 
                  className={`border rounded-lg p-4 ${
                    needsValidation ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {maintenance.pirogue}
                        </h3>
                        {needsValidation && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Validation requise
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Mécanicien:</span> {maintenance.mechanic}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(maintenance.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {maintenance.description}
                      </p>
                      
                      {/* Statuts de validation */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {validationStatuses.map((status, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            {status.label}
                          </span>
                        ))}
                        
                        {/* Afficher les validations manquantes */}
                        {!maintenance.pilotValidated && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-600">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            Pilote
                          </span>
                        )}
                        {!maintenance.hseValidated && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-600">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            HSE/Admin
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedMaintenance(maintenance.id)}
                        className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                          needsValidation 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {needsValidation ? 'Valider' : 'Voir'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingMaintenanceList;