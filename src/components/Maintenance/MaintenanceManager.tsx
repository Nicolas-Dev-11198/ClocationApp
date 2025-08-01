import React, { useState, useEffect } from 'react';
import { MaintenanceSheet } from '../../types';
import MaintenanceList from './MaintenanceList';
import MaintenanceForm from './MaintenanceForm';

const MaintenanceManager: React.FC = () => {
  const [maintenanceSheets, setMaintenanceSheets] = useState<MaintenanceSheet[]>([]);
  const [editingSheet, setEditingSheet] = useState<MaintenanceSheet | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load maintenance sheets from localStorage
    const savedSheets = localStorage.getItem('clocation_maintenance_sheets');
    if (savedSheets) {
      const parsed = JSON.parse(savedSheets);
      setMaintenanceSheets(parsed.map((sheet: any) => ({
        ...sheet,
        interventionDate: new Date(sheet.interventionDate),
        createdAt: new Date(sheet.createdAt)
      })));
    }
  }, []);

  const saveSheets = (newSheets: MaintenanceSheet[]) => {
    setMaintenanceSheets(newSheets);
    localStorage.setItem('clocation_maintenance_sheets', JSON.stringify(newSheets));
  };

  const handleSave = (sheetData: Omit<MaintenanceSheet, 'id' | 'createdAt'>) => {
    if (editingSheet) {
      // Update existing sheet
      const updatedSheets = maintenanceSheets.map(sheet =>
        sheet.id === editingSheet.id
          ? { ...sheetData, id: editingSheet.id, createdAt: editingSheet.createdAt }
          : sheet
      );
      saveSheets(updatedSheets);
    } else {
      // Create new sheet
      const newSheet: MaintenanceSheet = {
        ...sheetData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      saveSheets([...maintenanceSheets, newSheet]);
    }

    setEditingSheet(null);
    setShowForm(false);
  };

  const handleEdit = (sheet: MaintenanceSheet) => {
    setEditingSheet(sheet);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingSheet(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSheet(null);
    setShowForm(false);
  };

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
    <MaintenanceList
      maintenanceSheets={maintenanceSheets}
      onEdit={handleEdit}
      onNew={handleNew}
    />
  );
};

export default MaintenanceManager;