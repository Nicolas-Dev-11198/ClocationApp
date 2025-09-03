import { logbookService } from './api';
import { Logbook } from '../types';

export class LogbookService {
  private static instance: LogbookService;
  private logbooks: Logbook[] = [];
  private initialized = false;

  static getInstance(): LogbookService {
    if (!LogbookService.instance) {
      LogbookService.instance = new LogbookService();
    }
    return LogbookService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const response = await logbookService.getAll();
      this.logbooks = response.data || response.logbooks || response || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize logbook service:', error);
      this.logbooks = [];
      this.initialized = true;
    }
  }

  async getAllLogbooks(): Promise<Logbook[]> {
    await this.initialize();
    return this.logbooks;
  }

  async getAll(): Promise<Logbook[]> {
    try {
      const response = await logbookService.getAll();
      this.logbooks = response.data || response.logbooks || response || [];
      return this.logbooks;
    } catch (error) {
      console.error('Failed to fetch logbooks:', error);
      return this.logbooks;
    }
  }

  async createLogbook(logbookData: Omit<Logbook, 'id' | 'createdAt'>): Promise<Logbook> {
    try {
      const response = await logbookService.createLogbook(logbookData);
      const newLogbook = response.data || response.logbook || response;
      this.logbooks.push(newLogbook);
      return newLogbook;
    } catch (error) {
      console.error('Failed to create logbook:', error);
      throw error;
    }
  }

  async updateLogbook(id: string, logbookData: Partial<Logbook>): Promise<Logbook> {
    try {
      const response = await logbookService.updateLogbook(parseInt(id), logbookData);
      const updatedLogbook = response.data || response.logbook || response;
      
      const index = this.logbooks.findIndex(l => l.id === id);
      if (index !== -1) {
        this.logbooks[index] = updatedLogbook;
      }
      
      return updatedLogbook;
    } catch (error) {
      console.error('Failed to update logbook:', error);
      throw error;
    }
  }

  async deleteLogbook(id: string): Promise<void> {
    try {
      await logbookService.deleteLogbook(parseInt(id));
      this.logbooks = this.logbooks.filter(l => l.id !== id);
    } catch (error) {
      console.error('Failed to delete logbook:', error);
      throw error;
    }
  }

  // Local methods for filtering and searching
  getLogbookById(id: string): Logbook | undefined {
    return this.logbooks.find(l => l.id === id);
  }

  getLogbooksByPirogue(pirogue: string): Logbook[] {
    return this.logbooks.filter(l => l.pirogue === pirogue);
  }

  getLogbooksByPilot(pilot: string): Logbook[] {
    return this.logbooks.filter(l => l.pilot === pilot);
  }

  getLogbooksByDateRange(startDate: Date, endDate: Date): Logbook[] {
    return this.logbooks.filter(l => {
      const logbookDate = new Date(l.date);
      return logbookDate >= startDate && logbookDate <= endDate;
    });
  }

  searchLogbooks(searchTerm: string): Logbook[] {
    const term = searchTerm.toLowerCase();
    return this.logbooks.filter(l => 
      l.pirogue.toLowerCase().includes(term) ||
      l.pilot.toLowerCase().includes(term) ||
      l.copilot?.toLowerCase().includes(term) ||
      l.sailor?.toLowerCase().includes(term) ||
      l.comments?.toLowerCase().includes(term)
    );
  }
}

export const logbookServiceInstance = LogbookService.getInstance();