import { maintenanceService } from './api';
import { MaintenanceSheet } from '../types';

export class MaintenanceService {
  private static instance: MaintenanceService;
  private maintenanceSheets: MaintenanceSheet[] = [];
  private initialized = false;

  static getInstance(): MaintenanceService {
    if (!MaintenanceService.instance) {
      MaintenanceService.instance = new MaintenanceService();
    }
    return MaintenanceService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const response = await maintenanceService.getAll();
      this.maintenanceSheets = response.data || response.maintenanceSheets || response || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize maintenance service:', error);
      this.maintenanceSheets = [];
      this.initialized = true;
    }
  }

  async getAllMaintenanceSheets(): Promise<MaintenanceSheet[]> {
    await this.initialize();
    return this.maintenanceSheets;
  }

  async getAll(): Promise<MaintenanceSheet[]> {
    await this.initialize();
    return this.maintenanceSheets;
  }

  async createMaintenanceSheet(sheetData: Omit<MaintenanceSheet, 'id' | 'createdAt'>): Promise<MaintenanceSheet> {
    try {
      const response = await maintenanceService.createMaintenance(sheetData);
      const newSheet = response;
      this.maintenanceSheets.push(newSheet);
      return newSheet;
    } catch (error) {
      console.error('Failed to create maintenance sheet:', error);
      throw error;
    }
  }

  async updateMaintenanceSheet(id: string, sheetData: Partial<MaintenanceSheet>): Promise<MaintenanceSheet> {
    try {
      const response = await maintenanceService.updateMaintenance(id, sheetData);
      const updatedSheet = response;
      
      const index = this.maintenanceSheets.findIndex(s => s.id === id);
      if (index !== -1) {
        this.maintenanceSheets[index] = updatedSheet;
      }
      
      return updatedSheet;
    } catch (error) {
      console.error('Failed to update maintenance sheet:', error);
      throw error;
    }
  }

  async deleteMaintenanceSheet(id: string): Promise<void> {
    try {
      await maintenanceService.deleteMaintenance(id);
      this.maintenanceSheets = this.maintenanceSheets.filter(s => s.id !== id);
    } catch (error) {
      console.error('Failed to delete maintenance sheet:', error);
      throw error;
    }
  }

  // Local methods for filtering and searching
  getMaintenanceSheetById(id: string): MaintenanceSheet | undefined {
    return this.maintenanceSheets.find(s => s.id === id);
  }

  getMaintenanceSheetsByPirogue(pirogue: string): MaintenanceSheet[] {
    return this.maintenanceSheets.filter(s => s.pirogue === pirogue);
  }

  getMaintenanceSheetsByTechnician(technician: string): MaintenanceSheet[] {
    return this.maintenanceSheets.filter(s => s.technician === technician);
  }

  getMaintenanceSheetsByDateRange(startDate: Date, endDate: Date): MaintenanceSheet[] {
    return this.maintenanceSheets.filter(s => {
      const sheetDate = new Date(s.date);
      return sheetDate >= startDate && sheetDate <= endDate;
    });
  }

  getMaintenanceSheetsByStatus(status: 'pending' | 'in_progress' | 'completed'): MaintenanceSheet[] {
    return this.maintenanceSheets.filter(s => s.status === status);
  }

  searchMaintenanceSheets(searchTerm: string): MaintenanceSheet[] {
    const term = searchTerm.toLowerCase();
    return this.maintenanceSheets.filter(s => 
      s.pirogue.toLowerCase().includes(term) ||
      s.technician.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.interventions.some(i => 
        i.description.toLowerCase().includes(term) ||
        i.partsUsed.some(p => p.name.toLowerCase().includes(term))
      )
    );
  }

  getPendingMaintenanceSheets(): MaintenanceSheet[] {
    return this.maintenanceSheets.filter(s => s.status === 'pending');
  }

  getOverdueMaintenanceSheets(): MaintenanceSheet[] {
    const today = new Date();
    return this.maintenanceSheets.filter(s => {
      const dueDate = new Date(s.interventionDate);
      return s.status !== 'completed' && dueDate < today;
    });
  }
}

export const maintenanceServiceInstance = MaintenanceService.getInstance();