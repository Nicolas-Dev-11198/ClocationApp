import { bookingService } from './api';
import { Booking } from '../types';

export class BookingService {
  private static instance: BookingService;
  private bookings: Booking[] = [];
  private initialized = false;

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const response = await bookingService.getAll();
      this.bookings = response.data || response.bookings || response || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize booking service:', error);
      this.bookings = [];
      this.initialized = true;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    await this.initialize();
    return this.bookings;
  }

  async getAll(): Promise<Booking[]> {
    try {
      const response = await bookingService.getAll();
      this.bookings = response.data || response.bookings || response || [];
      return this.bookings;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return this.bookings;
    }
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    try {
      const response = await bookingService.createBooking(bookingData);
      const newBooking = response.data || response.booking || response;
      this.bookings.push(newBooking);
      return newBooking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking> {
    try {
      const response = await bookingService.updateBooking(parseInt(id), bookingData);
      const updatedBooking = response.data || response.booking || response;
      
      const index = this.bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        this.bookings[index] = updatedBooking;
      }
      
      return updatedBooking;
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      await bookingService.deleteBooking(parseInt(id));
      this.bookings = this.bookings.filter(b => b.id !== id);
    } catch (error) {
      console.error('Failed to delete booking:', error);
      throw error;
    }
  }

  // Local methods for filtering and searching
  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  getBookingsByPirogue(pirogue: string): Booking[] {
    return this.bookings.filter(b => b.pirogue === pirogue);
  }

  getBookingsByClient(client: string): Booking[] {
    return this.bookings.filter(b => b.client === client);
  }

  getBookingsByDateRange(startDate: Date, endDate: Date): Booking[] {
    return this.bookings.filter(b => {
      const bookingStart = new Date(b.startDate);
      const bookingEnd = new Date(b.endDate);
      return (bookingStart >= startDate && bookingStart <= endDate) ||
             (bookingEnd >= startDate && bookingEnd <= endDate) ||
             (bookingStart <= startDate && bookingEnd >= endDate);
    });
  }

  getBookingsByStatus(status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'): Booking[] {
    return this.bookings.filter(b => b.status === status);
  }

  searchBookings(searchTerm: string): Booking[] {
    const term = searchTerm.toLowerCase();
    return this.bookings.filter(b => 
      b.pirogue.toLowerCase().includes(term) ||
      b.client.toLowerCase().includes(term) ||
      b.purpose?.toLowerCase().includes(term) ||
      b.notes?.toLowerCase().includes(term)
    );
  }

  getPendingBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'pending');
  }

  getActiveBookings(): Booking[] {
    const today = new Date();
    return this.bookings.filter(b => {
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);
      return startDate <= today && endDate >= today && b.status === 'confirmed';
    });
  }

  getUpcomingBookings(days: number = 7): Booking[] {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return this.bookings.filter(b => {
      const startDate = new Date(b.startDate);
      return startDate >= today && startDate <= futureDate && b.status === 'confirmed';
    });
  }

  checkAvailability(pirogue: string, startDate: Date, endDate: Date, excludeBookingId?: string): boolean {
    const conflictingBookings = this.bookings.filter(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.pirogue !== pirogue) return false;
      if (b.status === 'cancelled') return false;
      
      const bookingStart = new Date(b.startDate);
      const bookingEnd = new Date(b.endDate);
      
      return (startDate >= bookingStart && startDate <= bookingEnd) ||
             (endDate >= bookingStart && endDate <= bookingEnd) ||
             (startDate <= bookingStart && endDate >= bookingEnd);
    });
    
    return conflictingBookings.length === 0;
  }
}

export const bookingServiceInstance = BookingService.getInstance();