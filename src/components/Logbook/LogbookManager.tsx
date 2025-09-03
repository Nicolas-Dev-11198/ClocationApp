import React, { useState, useEffect } from 'react';
import { Logbook as UILogbook } from '../../types';
import { Logbook as ApiLogbook, LogbookFilters, PaginatedResponse } from '../../types/api';
import LogbookList from './LogbookList';
import LogbookForm from './LogbookForm';
import Pagination from '../common/Pagination';
import { logbookService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AccessDenied } from '../Common/PermissionGuard';

// Fonctions de mapping entre les types API et UI
const mapApiLogbookToUI = (apiLogbook: ApiLogbook): UILogbook => {
  return {
    id: apiLogbook.id ? apiLogbook.id.toString() : `temp-${Date.now()}-${Math.random()}`,
    pirogue: apiLogbook.pirogue || '',
    pilot: apiLogbook.pilot || '',
    copilot: undefined,
    sailor: undefined,
    date: new Date(apiLogbook.created_at || new Date()),
    safetyChecklist: {
      lifeJackets: false,
      fireExtinguisher: false,
      firstAidKit: false,
      emergencyFlares: false,
      radio: false,
      gps: false,
      anchor: false,
      bilgePump: false,
      fuelLevel: false,
      engineCheck: false,
      hullInspection: false,
      weatherCheck: false,
      passengerBriefing: false,
      emergencyProcedures: false,
      toolboxMeeting: false,
      toolboxTheme: ''
    },
    trips: [],
    comments: apiLogbook.observations || '',
    mechanicalIntervention: false,
    pilotValidated: false,
    logisticsValidated: false,
    createdAt: new Date(apiLogbook.created_at || new Date())
  };
};

const mapUILogbookToApi = (uiLogbook: Omit<UILogbook, 'id' | 'createdAt'>): any => {
  return {
    pirogue: uiLogbook.pirogue,
    pilot: uiLogbook.pilot,
    copilot: uiLogbook.copilot,
    sailor: uiLogbook.sailor,
    departure_time: new Date().toISOString(),
    arrival_time: new Date().toISOString(),
    departure_location: uiLogbook.trips[0]?.departurePoint || '',
    arrival_location: uiLogbook.trips[0]?.arrivalPoint || '',
    passengers: 0,
    cargo_weight: 0,
    weather_conditions: '',
    observations: uiLogbook.comments || '',
    fuel_consumption: 0,
    status: 'active'
  };
};

const LogbookManager: React.FC = () => {
  const [logbooks, setLogbooks] = useState<UILogbook[]>([]);
  const [editingLogbook, setEditingLogbook] = useState<UILogbook | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
    from: 0,
    to: 0
  });
  const [filters, setFilters] = useState<LogbookFilters>({
    page: 1,
    per_page: 5
  });
  const { showToast } = useToast();
  const permissions = usePermissions();

  // Check permissions
  if (!permissions.canFillLogbook && !permissions.canValidateLogbook) {
    return <AccessDenied />;
  }

  useEffect(() => {
    loadLogbooks();
  }, []);

  const loadLogbooks = async (currentFilters: LogbookFilters = filters) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<ApiLogbook> = await logbookService.getAll(currentFilters);
      setLogbooks(response.data.map(mapApiLogbookToUI));
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load logbooks:', error);
      showToast('error', 'Erreur lors du chargement des carnets de bord');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (logbookData: Omit<UILogbook, 'id' | 'createdAt'>) => {
    if (!permissions.canFillLogbook) return;
    try {
      const apiData = mapUILogbookToApi(logbookData);
      
      if (editingLogbook) {
        // Update existing logbook
        await logbookService.updateLogbook(parseInt(editingLogbook.id), apiData);
        showToast('success', 'Carnet de bord modifié avec succès');
      } else {
        // Create new logbook
        await logbookService.createLogbook(apiData);
        showToast('success', 'Carnet de bord créé avec succès');
      }
      
      // Reload logbooks to get updated data
      await loadLogbooks();
      setEditingLogbook(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save logbook:', error);
      showToast('error', 'Erreur lors de l\'enregistrement du carnet de bord');
    }
  };

  const handleEdit = (logbook: UILogbook) => {
    if (!permissions.canFillLogbook) return;
    setEditingLogbook(logbook);
    setShowForm(true);
  };

  const handleNew = () => {
    if (!permissions.canFillLogbook) return;
    setEditingLogbook(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingLogbook(null);
    setShowForm(false);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    loadLogbooks(newFilters);
  };

  const handlePerPageChange = (perPage: number) => {
    const newFilters = { ...filters, per_page: perPage, page: 1 };
    setFilters(newFilters);
    loadLogbooks(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des carnets de bord...</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <LogbookForm
        logbook={editingLogbook}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <LogbookList
        logbooks={logbooks}
        onEdit={handleEdit}
        onNew={handleNew}
      />
      {logbooks.length > 0 && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default LogbookManager;