export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: Date;
  hrData?: HRData;
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

export type UserRole = 'directeur' | 'drh' | 'responsable_logistique' | 'pilote' | 'mecanicien';

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
  createdAt: Date;
}

export interface SafetyChecklist {
  hullCondition: boolean;
  roofCondition: boolean;
  fireExtinguisher: boolean;
  flare: boolean;
  flashlight: boolean;
  firstAidKit: boolean;
  circuitBreaker: boolean;
  vhfRadio: boolean;
  bluRadio: boolean;
  chekesFilter: boolean;
  buoyWithRope: boolean;
  fogRope: boolean;
  scoop: boolean;
  pole: boolean;
  oars: boolean;
  grapple: boolean;
  anchor: boolean;
  garbageBags: boolean;
  sufficientVests: boolean;
  signageVisible: boolean;
  chartsAndProcedures: boolean;
  spotsOperational: boolean;
  backupSpots: boolean;
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
}

export const LOCATIONS = [
  'Saint-Anne',
  'Port-Gentil',
  'Dianogo',
  'Batanga',
  'Ombouée',
  'Ignouga',
  'Coucal',
  'Onal'
] as const;

export const PIROGUES = [
  'C1', 'C2', 'C3', 'C5', 'C6', 'C7', 'C8', 
  'CBianca', 'CFlavienne', 'Cmanou'
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  directeur: 'Directeur',
  drh: 'DRH',
  responsable_logistique: 'Responsable logistique',
  pilote: 'Pilote',
  mecanicien: 'Mécanicien'
};