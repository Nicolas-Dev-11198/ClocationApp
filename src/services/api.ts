import axios from 'axios';
import {
  RegisterData,
  AuthResponse,
  User,
  UpdateUserData,
  HRData,
  LogbookFilters,
  LogbookData,
  Logbook,
  MaintenanceFilters,
  MaintenanceData,
  Maintenance,
  BookingFilters,
  BookingData,
  Booking,
  DashboardStats,
  FleetPerformance,
  MaintenanceReport,
  LogbookReport,
  ExportFilters,
  ApiResponse,
  PaginatedResponse,
  AvailabilityCheck,
  Schedule
} from '../types/api';

// Configuration de base d'Axios
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Augmenté à 60 secondes pour éviter les timeouts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string): Promise<AuthResponse> => {
    const response = await api.patch<AuthResponse>(`/users/${userId}/status`, { status });
    return response.data;
  },

  updateProfile: async (userData: UpdateUserData): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data.data;
  },
};

// Services utilisateurs
export const userService = {
  getAll: async (params?: { per_page?: number; page?: number; role?: string; status?: string; search?: string }): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  updateUserStatus: async (id: number, status: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/status`, { status });
    return response.data.data;
  },

  updateHRData: async (id: number, hrData: HRData): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/hr`, hrData);
    return response.data.data;
  },

  approveUser: async (id: number): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/approve`);
    return response.data.data;
  },

  rejectUser: async (id: number): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/reject`);
    return response.data.data;
  },

  getPendingUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users/pending/list');
    return response.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Services carnets de bord
export const logbookService = {
  getAll: async (filters?: LogbookFilters): Promise<PaginatedResponse<Logbook>> => {
    const response = await api.get<PaginatedResponse<Logbook>>('/logbooks', { params: filters });
    return response.data;
  },
  
  getLogbooks: async (filters?: LogbookFilters): Promise<Logbook[]> => {
    const response = await api.get<ApiResponse<Logbook[]>>('/logbooks', { params: filters });
    return response.data.data;
  },

  getLogbookById: async (id: number): Promise<Logbook> => {
    const response = await api.get<ApiResponse<Logbook>>(`/logbooks/${id}`);
    return response.data.data;
  },

  createLogbook: async (logbookData: LogbookData): Promise<Logbook> => {
    const response = await api.post<ApiResponse<Logbook>>('/logbooks', logbookData);
    return response.data.data;
  },

  updateLogbook: async (id: number, logbookData: Partial<LogbookData>): Promise<Logbook> => {
    const response = await api.put<ApiResponse<Logbook>>(`/logbooks/${id}`, logbookData);
    return response.data.data;
  },

  updateLogbookStatus: async (id: number, status: string): Promise<Logbook> => {
    const response = await api.patch<ApiResponse<Logbook>>(`/logbooks/${id}/status`, { status });
    return response.data.data;
  },

  deleteLogbook: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/logbooks/${id}`);
    return response.data;
  },

  getLogbookStats: async (): Promise<LogbookReport> => {
    const response = await api.get<ApiResponse<LogbookReport>>('/logbooks/stats');
    return response.data.data;
  },
};

// Services maintenance
export const maintenanceService = {
  getAll: async (filters?: MaintenanceFilters): Promise<PaginatedResponse<Maintenance>> => {
    const response = await api.get<PaginatedResponse<Maintenance>>('/maintenances', { params: filters });
    return response.data;
  },
  
  getMaintenanceSheets: async (filters?: MaintenanceFilters): Promise<Maintenance[]> => {
    const response = await api.get<ApiResponse<Maintenance[]>>('/maintenances', { params: filters });
    return response.data.data;
  },

  getMaintenanceById: async (id: string): Promise<Maintenance> => {
    const response = await api.get<ApiResponse<Maintenance>>(`/maintenances/${id}`);
    return response.data.data;
  },

  createMaintenance: async (maintenanceData: MaintenanceData): Promise<Maintenance> => {
    const response = await api.post<ApiResponse<Maintenance>>('/maintenances', maintenanceData);
    return response.data.data;
  },

  updateMaintenance: async (id: string, maintenanceData: Partial<MaintenanceData>): Promise<Maintenance> => {
    const response = await api.put<ApiResponse<Maintenance>>(`/maintenances/${id}`, maintenanceData);
    return response.data.data;
  },

  updateMaintenanceStatus: async (id: string, status: string): Promise<Maintenance> => {
    const response = await api.patch<ApiResponse<Maintenance>>(`/maintenances/${id}/status`, { status });
    return response.data.data;
  },

  deleteMaintenance: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/maintenances/${id}`);
    return response.data;
  },

  getMaintenanceStats: async (): Promise<MaintenanceReport> => {
    const response = await api.get<ApiResponse<MaintenanceReport>>('/reports/maintenances');
    return response.data.data;
  },

  getUpcomingMaintenance: async (): Promise<Maintenance[]> => {
    const response = await api.get<ApiResponse<Maintenance[]>>('/maintenances?status=scheduled');
    return response.data.data;
  },

  getMaintenanceHistory: async (vehicleId: string): Promise<Maintenance[]> => {
    const response = await api.get<ApiResponse<Maintenance[]>>(`/maintenances/vehicle/${vehicleId}`);
    return response.data.data;
  },
};

// Services réservations
export const bookingService = {
  getAll: async (filters?: BookingFilters): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get<PaginatedResponse<Booking>>('/bookings', { params: filters });
    return response.data;
  },
  
  getBookings: async (filters?: BookingFilters): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings', { params: filters });
    return response.data.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  createBooking: async (bookingData: BookingData): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data.data;
  },

  updateBooking: async (id: number, bookingData: Partial<BookingData>): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, bookingData);
    return response.data.data;
  },

  updateBookingStatus: async (id: number, status: string): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data.data;
  },

  deleteBooking: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/bookings/${id}`);
    return response.data;
  },

  getBookingStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/bookings/stats');
    return response.data.data;
  },

  getTodayBookings: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings/today');
    return response.data.data;
  },

  getUpcomingBookings: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings/upcoming');
    return response.data.data;
  },

  checkAvailability: async (pirogue: string, date: string, time: string): Promise<AvailabilityCheck> => {
    const response = await api.get<ApiResponse<AvailabilityCheck>>('/bookings/availability', {
      params: { pirogue, date, time }
    });
    return response.data.data;
  },

  getPilotSchedule: async (pilot: string, date: string): Promise<Schedule> => {
    const response = await api.get<ApiResponse<Schedule>>('/bookings/pilot-schedule', {
      params: { pilot, date }
    });
    return response.data.data;
  },

  getPirogueSchedule: async (pirogue: string, date: string): Promise<Schedule> => {
    const response = await api.get<ApiResponse<Schedule>>('/bookings/pirogue-schedule', {
      params: { pirogue, date }
    });
    return response.data.data;
  },
};

// Services rapports
export const reportService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/reports/dashboard');
    return response.data.data;
  },

  getFleetPerformance: async (startDate?: string, endDate?: string): Promise<FleetPerformance> => {
    const response = await api.get<ApiResponse<FleetPerformance>>('/reports/bookings', {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  getMaintenanceReport: async (startDate?: string, endDate?: string): Promise<MaintenanceReport> => {
    const response = await api.get<ApiResponse<MaintenanceReport>>('/reports/maintenances', {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  getLogbookReport: async (startDate?: string, endDate?: string): Promise<LogbookReport> => {
    const response = await api.get<ApiResponse<LogbookReport>>('/reports/logbooks', {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  exportBookings: async (format: string = 'excel', filters?: ExportFilters): Promise<Blob> => {
    const response = await api.get<Blob>('/exports/bookings', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  exportLogbooks: async (format: string = 'excel', filters?: ExportFilters): Promise<Blob> => {
    const response = await api.get<Blob>('/exports/logbooks', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  exportMaintenances: async (format: string = 'excel', filters?: ExportFilters): Promise<Blob> => {
    const response = await api.get<Blob>('/exports/maintenances', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  exportUsers: async (format: string = 'excel', filters?: ExportFilters): Promise<Blob> => {
    const response = await api.get<Blob>('/exports/users', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  exportSingleLogbook: async (id: number): Promise<Blob> => {
    const response = await api.get<Blob>(`/exports/logbooks/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportSingleMaintenance: async (id: number): Promise<Blob> => {
    const response = await api.get<Blob>(`/exports/maintenances/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;