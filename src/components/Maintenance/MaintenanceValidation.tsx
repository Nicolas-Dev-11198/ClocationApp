import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { maintenanceValidationService, MaintenanceValidationRequest } from '../../services/maintenanceValidationService';
import { usePermissions, useRoleCheck } from '../../hooks/usePermissions';
import { useToast } from '../../contexts/ToastContext';

interface MaintenanceValidationProps {
  maintenanceId: string;
  onValidationComplete?: () => void;
}

interface MaintenanceData {
  id: string;
  pirogue: string;
  mechanic: string;
  date: string;
  description: string;
  mechanicValidated: boolean;
  pilotValidated: boolean;
  hseValidated: boolean;
  validation_comments?: string;
  status: string;
}

export const MaintenanceValidation: React.FC<MaintenanceValidationProps> = ({
  maintenanceId,
  onValidationComplete
}) => {
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [comments, setComments] = useState('');
  const { canValidateMaintenance } = usePermissions();
  const { isPilote, isDirecteur, isLogisticien } = useRoleCheck();
  const { showToast } = useToast();

  useEffect(() => {
    loadMaintenance();
  }, [maintenanceId]);

  const loadMaintenance = async () => {
    try {
      setLoading(true);
      const data = await maintenanceValidationService.getMaintenanceForValidation(maintenanceId);
      setMaintenance(data);
      setComments(data.validation_comments || '');
    } catch (error: any) {
      showToast('error', 'Erreur', error.message || 'Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (isValid: boolean) => {
    if (!maintenance || !canValidateMaintenance) return;

    try {
      setValidating(true);
      
      let validation_type: 'pilot' | 'admin' | 'logistics';
      if (isPilote) {
        validation_type = 'pilot';
      } else if (isDirecteur) {
        validation_type = 'admin';
      } else if (isLogisticien) {
        validation_type = 'logistics';
      } else {
        showToast('error', 'Erreur', 'Vous n\'avez pas les permissions pour valider ce rapport');
        return;
      }

      const validationData: MaintenanceValidationRequest = {
        validation_type,
        validated: isValid,
        comments: comments.trim() || undefined
      };

      await maintenanceValidationService.validateMaintenance(maintenanceId, validationData);
      
      showToast(
        'success',
        'Succès',
        isValid 
          ? 'Rapport de maintenance validé avec succès' 
          : 'Rapport de maintenance rejeté'
      );
      
      await loadMaintenance();
      onValidationComplete?.();
    } catch (error: any) {
      showToast('error', 'Erreur', error.message || 'Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const getValidationStatus = () => {
    if (!maintenance) return null;

    const statuses = [];
    
    if (maintenance.mechanicValidated) {
      statuses.push({ label: 'Mécanicien', status: 'validated', icon: CheckCircle });
    } else {
      statuses.push({ label: 'Mécanicien', status: 'pending', icon: Clock });
    }

    if (maintenance.pilotValidated) {
      statuses.push({ label: 'Pilote', status: 'validated', icon: CheckCircle });
    } else {
      statuses.push({ label: 'Pilote', status: 'pending', icon: Clock });
    }

    if (maintenance.hseValidated) {
      statuses.push({ label: 'HSE/Admin', status: 'validated', icon: CheckCircle });
    } else {
      statuses.push({ label: 'HSE/Admin', status: 'pending', icon: Clock });
    }

    return statuses;
  };

  const canUserValidate = () => {
    if (!maintenance || !canValidateMaintenance) return false;
    
    if (isPilote && !maintenance.pilotValidated) return true;
    if ((isDirecteur || isLogisticien) && !maintenance.hseValidated) return true;
    
    return false;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-center text-gray-500">
            Rapport de maintenance non trouvé
          </div>
        </div>
      </div>
    );
  }

  const validationStatuses = getValidationStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Validation du Rapport de Maintenance
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Informations du rapport */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Pirogue</label>
            <p className="text-sm">{maintenance.pirogue}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Mécanicien</label>
            <p className="text-sm">{maintenance.mechanic}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Date</label>
            <p className="text-sm">{new Date(maintenance.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Statut</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              maintenance.status === 'completed' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {maintenance.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-600">Description</label>
          <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{maintenance.description}</p>
        </div>

        {/* Statuts de validation */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-3 block">Statuts de validation</label>
          <div className="flex flex-wrap gap-3">
            {validationStatuses?.map((status, index) => {
              const Icon = status.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon 
                    className={`h-4 w-4 ${
                      status.status === 'validated' ? 'text-green-500' : 'text-gray-400'
                    }`} 
                  />
                  <span className={`text-sm ${
                    status.status === 'validated' ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commentaires de validation */}
        {maintenance.validation_comments && (
          <div>
            <label className="text-sm font-medium text-gray-600">Commentaires de validation</label>
            <p className="text-sm mt-1 p-3 bg-blue-50 rounded-md">{maintenance.validation_comments}</p>
          </div>
        )}

        {/* Section de validation pour l'utilisateur actuel */}
        {canUserValidate() && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Votre validation</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Commentaires (optionnel)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ajoutez vos commentaires sur ce rapport de maintenance..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleValidation(true)}
                  disabled={validating}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider
                </button>
                <button
                  onClick={() => handleValidation(false)}
                  disabled={validating}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        )}

        {!canValidateMaintenance && (
          <div className="text-center text-gray-500 text-sm">
            Vous n'avez pas les permissions pour valider ce rapport
          </div>
        )}

        {canValidateMaintenance && !canUserValidate() && (
          <div className="text-center text-gray-500 text-sm">
            Ce rapport a déjà été validé par votre rôle ou ne nécessite pas votre validation
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceValidation;