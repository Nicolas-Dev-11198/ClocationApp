export interface User {
  id: string;
  name: string;
  fullName?: string; // Pour compatibilité
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  department?: string;
  position?: string;
  profilePhoto?: string;
  isActive?: boolean;
  createdAt?: Date;
  hireDate?: Date;
  salary?: number;
  address?: string;
  hrData?: HRData;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface HRData {
  contractStart?: Date;
  contractEnd?: Date;
  medicalVisitStart?: Date;
  medicalVisitEnd?: Date;
  derogationStart?: Date;
  derogationEnd?: Date;
  inductionStart?: Date;
  inductionEnd?: Date;
  cnssNumber?: string;
  payrollNumber?: string;
}

export type UserRole = 'director' | 'pilote' | 'mecanicien' | 'logisticien' | 'rh';

export interface UserPermissions {
  canViewAll: boolean;
  canValidateAll: boolean;
  canManageUsers: boolean;
  canCreateBookings: boolean;
  canFillLogbook: boolean;
  canValidateLogbook: boolean;
  canFillMaintenance: boolean;
  canValidateMaintenance: boolean;
  canViewReports: boolean;
  canModifyUsers: boolean;
  canApproveRegistrations: boolean;
  canApproveUsers: boolean;
  canManageLogbook: boolean;
  canManageMaintenance: boolean;
  canManageBookings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  director: {
    canViewAll: true,
    canValidateAll: true,
    canManageUsers: true,
    canCreateBookings: true,
    canFillLogbook: true,
    canValidateLogbook: true,
    canFillMaintenance: true,
    canValidateMaintenance: true,
    canViewReports: true,
    canModifyUsers: true,
    canApproveRegistrations: true,
    canApproveUsers: true,
    canManageLogbook: true,
    canManageMaintenance: true,
    canManageBookings: true
  },
  pilote: {
    canViewAll: false,
    canValidateAll: false,
    canManageUsers: false,
    canCreateBookings: true,
    canFillLogbook: true,
    canValidateLogbook: false,
    canFillMaintenance: false,
    canValidateMaintenance: true,
    canViewReports: false,
    canModifyUsers: false,
    canApproveRegistrations: false,
    canApproveUsers: false,
    canManageLogbook: true,
    canManageMaintenance: false,
    canManageBookings: true
  },
  mecanicien: {
    canViewAll: false,
    canValidateAll: false,
    canManageUsers: false,
    canCreateBookings: false,
    canFillLogbook: false,
    canValidateLogbook: false,
    canFillMaintenance: true,
    canValidateMaintenance: true,
    canViewReports: true,
    canModifyUsers: false,
    canApproveRegistrations: false,
    canApproveUsers: false,
    canManageLogbook: false,
    canManageMaintenance: true,
    canManageBookings: false
  },
  logisticien: {
    canViewAll: true,
    canValidateAll: false,
    canManageUsers: true,
    canCreateBookings: true,
    canFillLogbook: false,
    canValidateLogbook: true,
    canFillMaintenance: false,
    canValidateMaintenance: true,
    canViewReports: true,
    canModifyUsers: false,
    canApproveRegistrations: false,
    canApproveUsers: false,
    canManageLogbook: true,
    canManageMaintenance: true,
    canManageBookings: true
  },
  rh: {
    canViewAll: true,
    canValidateAll: false,
    canManageUsers: true,
    canCreateBookings: false,
    canFillLogbook: false,
    canValidateLogbook: false,
    canFillMaintenance: false,
    canValidateMaintenance: false,
    canViewReports: true,
    canModifyUsers: true,
    canApproveRegistrations: true,
    canApproveUsers: true,
    canManageLogbook: true,
    canManageMaintenance: false,
    canManageBookings: false
  }
};

export interface Logbook {
  id: string;
  pirogue: string;
  pilot: string;
  copilot?: string;
  sailor?: string;
  date: Date;
  safetyChecklist: SafetyChecklist;
  trips: Trip[];
  comments?: string;
  mechanicalIntervention: boolean;
  pilotValidated: boolean;
  logisticsValidated: boolean;
  status?: 'pending' | 'validated' | 'in_progress';
  createdAt: Date;
  updatedAt?: Date;
}

export interface SafetyChecklist {
  lifeJackets: boolean;
  fireExtinguisher: boolean;
  firstAidKit: boolean;
  emergencyFlares: boolean;
  radio: boolean;
  gps: boolean;
  anchor: boolean;
  bilgePump: boolean;
  fuelLevel: boolean;
  engineCheck: boolean;
  hullInspection: boolean;
  weatherCheck: boolean;
  passengerBriefing: boolean;
  emergencyProcedures: boolean;
  toolboxMeeting: boolean;
  toolboxTheme?: string;
}

export interface Trip {
  id: string;
  departurePoint: string;
  departureTime: string;
  departureFuel: number;
  arrivalPoint: string;
  arrivalTime: string;
  arrivalFuel: number;
  pause1?: Pause;
  pause2?: Pause;
}

export interface Pause {
  time: string;
  location: string;
  fuel: number;
}

export interface MaintenanceSheet {
  id: string;
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
  createdAt: Date;
}

export interface Booking {
  id: string;
  scheduledDate: Date;
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
  createdAt: Date;
  // Propriétés pour compatibilité avec api.ts
  created_at?: string;
  updated_at?: string;
  departure_time?: string;
  estimated_return_time?: string;
  departure_location?: string;
  destination?: string;
  passengers?: number;
  cargo_description?: string;
  cargo_weight?: number;
  purpose?: string;
  special_requirements?: string;
  status?: string;
}

// Ces constantes sont maintenant récupérées dynamiquement depuis l'API
// Voir les services correspondants pour les données actuelles
export type LocationType = string;
export type PirogueType = string;

export const ROLE_LABELS: Record<UserRole, string> = {
  directeur: 'Directeur',
  pilote: 'Pilote',
  mecanicien: 'Mécanicien',
  logisticien: 'Responsable Logistique',
  rh: 'Ressources Humaines'
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente d\'approbation',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  active: 'Actif',
  inactive: 'Inactif'
};