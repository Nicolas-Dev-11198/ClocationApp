import React, { useState, useEffect } from 'react';
import { MaintenanceSheet } from '../../types';
import { Maintenance, MaintenanceFilters, PaginatedResponse } from '../../types/api';
import MaintenanceList from './MaintenanceList';
import MaintenanceForm from './MaintenanceForm';
import Pagination from '../common/Pagination';
import { maintenanceService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AccessDenied } from '../Common/PermissionGuard';

const MaintenanceManager: React.FC = () => {
  const [maintenanceSheets, setMaintenanceSheets] = useState<MaintenanceSheet[]>([]);
  const [editingSheet, setEditingSheet] = useState<MaintenanceSheet | null>(null);
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
  const [filters, setFilters] = useState<MaintenanceFilters>({
    page: 1,
    per_page: 5
  });
  const { showToast } = useToast();
  const permissions = usePermissions();

  // Check permissions
  if (!permissions.canFillMaintenance && !permissions.canValidateMaintenance) {
    return <AccessDenied />;
  }

  useEffect(() => {
    loadMaintenanceSheets();
  }, []);

  const loadMaintenanceSheets = async (currentFilters: MaintenanceFilters = filters) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Maintenance> = await maintenanceService.getAll(currentFilters);
      setMaintenanceSheets(response.data.map((sheet: Maintenance) => ({
        ...sheet,
        interventionDate: new Date(sheet.interventionDate),
        createdAt: new Date(sheet.createdAt)
      })));
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to
      });
    } catch (error) {
      console.error('Failed to load maintenance sheets:', error);
      showToast('error', 'Erreur', 'Erreur lors du chargement des fiches de maintenance');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (sheetData: Omit<MaintenanceSheet, 'id' | 'createdAt'>) => {
    if (!permissions.canFillMaintenance) return;
    try {
      if (editingSheet) {
        // Update existing sheet
        await maintenanceService.updateMaintenance(editingSheet.id, sheetData);
        showToast('success', 'Succès', 'Fiche de maintenance modifiée avec succès');
      } else {
        // Create new sheet
        await maintenanceService.createMaintenance(sheetData);
        showToast('success', 'Succès', 'Fiche de maintenance créée avec succès');
      }
      
      // Reload maintenance sheets to get updated data
      await loadMaintenanceSheets();
      setEditingSheet(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save maintenance sheet:', error);
      showToast('error', 'Erreur', 'Erreur lors de l\'enregistrement de la fiche de maintenance');
    }
  };

  const handleEdit = (sheet: MaintenanceSheet) => {
    if (!permissions.canFillMaintenance) return;
    setEditingSheet(sheet);
    setShowForm(true);
  };

  const handleNew = () => {
    if (!permissions.canFillMaintenance) return;
    setEditingSheet(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSheet(null);
    setShowForm(false);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    loadMaintenanceSheets(newFilters);
  };

  const handlePerPageChange = (perPage: number) => {
    const newFilters = { ...filters, per_page: perPage, page: 1 };
    setFilters(newFilters);
    loadMaintenanceSheets(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des fiches de maintenance...</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <MaintenanceForm
        maintenanceSheet={editingSheet}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <MaintenanceList
        maintenanceSheets={maintenanceSheets}
        onEdit={handleEdit}
        onNew={handleNew}
      />
      {maintenanceSheets.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default MaintenanceManager;