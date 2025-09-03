// Types pour les services API

// Types d'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  position?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// Types pour les utilisateurs
export interface UpdateUserData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: string;
}

export interface HRData {
  salary?: number;
  hire_date?: string;
  contract_type?: string;
  benefits?: string[];
  performance_rating?: number;
}

// Types pour les carnets de bord
export interface LogbookFilters {
  status?: string;
  pilot?: string;
  pirogue?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface LogbookData {
  pilot: string;
  pirogue: string;
  departure_time: string;
  arrival_time?: string;
  departure_location: string;
  arrival_location?: string;
  passengers: number;
  cargo_weight?: number;
  weather_conditions?: string;
  observations?: string;
  fuel_consumption?: number;
  status: string;
}

export interface Logbook extends LogbookData {
  id: number;
  created_at: string;
  updated_at: string;
}

// Types pour la maintenance
export interface MaintenanceFilters {
  status?: string;
  pirogue?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface MaintenanceData {
  location: string;
  pirogue: string;
  motorBrand: 'Yamaha' | 'Suzuki';
  equipmentSpecs: string;
  interventionDate: Date;
  interventionType: 'diagnostic' | 'reparation' | 'maintenance';
  responsiblePilot: string;
  designation: string;
  reference: string;
  quantity: number;
  workDescription: string;
  mechanicValidated: boolean;
  pilotValidated: boolean;
  hseValidated: boolean;
}

export interface Maintenance extends MaintenanceData {
  id: string;
  createdAt: Date;
}

// Types pour les réservations
export interface BookingFilters {
  status?: string;
  pilot?: string;
  pirogue?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface BookingData {
  scheduledDate: string;
  pirogue: string;
  pilot: string;
  copilot?: string;
  sailor?: string;
  passengerCount: number;
  departurePoint: string;
  arrivalPoint: string;
  baggageWeight: number;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  requesterName: string;
  requesterCompany: string;
  status: string;
}

export interface Booking extends BookingData {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}

// Types pour les statistiques
export interface DashboardStats {
  total_bookings: number;
  active_bookings: number;
  total_pirogues: number;
  available_pirogues: number;
  total_pilots: number;
  active_pilots: number;
  pending_maintenance: number;
  completed_trips: number;
}

export interface FleetPerformance {
  pirogue_utilization: Record<string, number>;
  pilot_performance: Record<string, number>;
  route_popularity: Record<string, number>;
  fuel_efficiency: Record<string, number>;
}

export interface MaintenanceReport {
  total_maintenance: number;
  completed_maintenance: number;
  pending_maintenance: number;
  maintenance_costs: number;
  average_downtime: number;
  maintenance_by_type: Record<string, number>;
}

export interface LogbookReport {
  total_trips: number;
  total_distance: number;
  total_passengers: number;
  total_cargo: number;
  fuel_consumption: number;
  trips_by_route: Record<string, number>;
}

// Types pour les exports
export interface ExportFilters {
  date_from?: string;
  date_to?: string;
  status?: string;
  pilot?: string;
  pirogue?: string;
  type?: string;
  search?: string;
}

export interface ExportResponse {
  url: string;
  filename: string;
  message: string;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Types pour la disponibilité
export interface AvailabilityCheck {
  available: boolean;
  conflicts?: Booking[];
  message?: string;
}

export interface Schedule {
  date: string;
  bookings: Booking[];
  available_slots: string[];
}