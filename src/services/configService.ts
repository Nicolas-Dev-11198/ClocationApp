import api from './api';
import { UserRole } from '../types';

interface Pirogue {
  id: string | number;
  name?: string;
  code?: string;
}

interface Location {
  id: string | number;
  name?: string;
  code?: string;
}

class ConfigService {
  private static instance: ConfigService;
  private pirogues: string[] = [];
  private locations: string[] = [];
  private interventionTypes: Array<{value: string, label: string}> = [];
  private motorBrands: Array<{value: string, label: string}> = [];
  private priorityOptions: Array<{value: string, label: string, color: string}> = [];
  private allowedRoles: UserRole[] = [];
  private safetyChecklistItems: Array<{key: string, label: string}> = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  // Fallback hardcoded values in case API fails
  private defaultPirogues = [
    'Pirogue 1',
    'Pirogue 2',
    'Pirogue 3',
    'Pirogue 4',
    'Pirogue 5'
  ];

  private defaultLocations = [
    'Port de Cayenne',
    'Îles du Salut',
    'Saint-Laurent-du-Maroni',
    'Kourou',
    'Sinnamary',
    'Iracoubo',
    'Mana',
    'Awala-Yalimapo',
    'Grand-Santi',
    'Maripasoula'
  ];

  private defaultInterventionTypes = [
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'reparation', label: 'Réparation' },
    { value: 'maintenance', label: 'Maintenance préventive' }
  ];

  private defaultMotorBrands = [
    { value: 'Yamaha', label: 'Yamaha' },
    { value: 'Suzuki', label: 'Suzuki' }
  ];

  private defaultPriorityOptions = [
    { value: 'Haute', label: 'Haute', color: 'text-red-600' },
    { value: 'Moyenne', label: 'Moyenne', color: 'text-yellow-600' },
    { value: 'Basse', label: 'Basse', color: 'text-green-600' }
  ];

  private defaultAllowedRoles: UserRole[] = ['pilote', 'mecanicien', 'logisticien', 'rh'];

  private defaultSafetyChecklistItems = [
    { key: 'lifeJackets', label: 'Gilets de sauvetage' },
    { key: 'fireExtinguisher', label: 'Extincteur' },
    { key: 'firstAidKit', label: 'Trousse de premiers secours' },
    { key: 'emergencyFlares', label: 'Fusées de détresse' },
    { key: 'radio', label: 'Radio' },
    { key: 'gps', label: 'GPS' },
    { key: 'anchor', label: 'Ancre' },
    { key: 'bilgePump', label: 'Pompe de cale' },
    { key: 'fuelLevel', label: 'Niveau de carburant' },
    { key: 'engineCheck', label: 'Vérification moteur' },
    { key: 'hullInspection', label: 'Inspection de la coque' },
    { key: 'weatherCheck', label: 'Vérification météo' },
    { key: 'passengerBriefing', label: 'Briefing passagers' },
    { key: 'emergencyProcedures', label: 'Procédures d\'urgence' },
    { key: 'toolboxMeeting', label: 'Toolbox Meeting' }
  ];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Récupérer les pirogues depuis l'API
      const piroguesResponse = await api.get('/config/pirogues');
      this.pirogues = piroguesResponse.data.map((p: Pirogue) => p.name || p.code || String(p.id));

      // Récupérer les locations depuis l'API
      const locationsResponse = await api.get('/config/locations');
      this.locations = locationsResponse.data.map((l: Location) => l.name || l.code || String(l.id));

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize config data:', error);
      // Fallback vers des données par défaut en cas d'erreur
      this.pirogues = ['C1', 'C2', 'C3', 'C5', 'C6', 'C7', 'C8', 'CBianca', 'CFlavienne', 'Cmanou'];
      this.locations = ['Saint-Anne', 'Port-Gentil', 'Dianogo', 'Batanga', 'Ombouée', 'Ignouga', 'Coucal', 'Onal'];
      this.initialized = true;
    }
  }

  async getPirogues(): Promise<string[]> {
    await this.initialize();
    return [...this.pirogues];
  }

  async getLocations(): Promise<string[]> {
    await this.initialize();
    return [...this.locations];
  }

  // Méthodes pour rafraîchir les données
  async refreshPirogues(): Promise<string[]> {
    try {
      const response = await api.get('/config/pirogues');
      this.pirogues = response.data.map((p: Pirogue) => p.name || p.code || String(p.id));
      return [...this.pirogues];
    } catch (error) {
      console.error('Failed to refresh pirogues:', error);
      return [...this.pirogues];
    }
  }

  async refreshLocations(): Promise<string[]> {
    try {
      const response = await api.get('/config/locations');
      this.locations = response.data.map((l: Location) => l.name || l.code || String(l.id));
      return [...this.locations];
    } catch (error) {
      console.error('Failed to refresh locations:', error);
      return [...this.locations];
    }
  }

  async getInterventionTypes(): Promise<Array<{value: string, label: string}>> {
    if (this.interventionTypes.length === 0) {
      try {
        const response = await api.get('/config/intervention-types');
        this.interventionTypes = response.data || this.defaultInterventionTypes;
      } catch (error) {
        console.warn('Failed to fetch intervention types from API, using defaults:', error);
        this.interventionTypes = this.defaultInterventionTypes;
      }
    }
    return this.interventionTypes;
  }

  async getMotorBrands(): Promise<Array<{value: string, label: string}>> {
    if (this.motorBrands.length === 0) {
      try {
        const response = await api.get('/config/motor-brands');
        this.motorBrands = response.data || this.defaultMotorBrands;
      } catch (error) {
        console.warn('Failed to fetch motor brands from API, using defaults:', error);
        this.motorBrands = this.defaultMotorBrands;
      }
    }
    return this.motorBrands;
  }

  async getPriorityOptions(): Promise<Array<{value: string, label: string, color: string}>> {
    if (this.priorityOptions.length === 0) {
      try {
        const response = await api.get('/config/priority-options');
        this.priorityOptions = response.data || this.defaultPriorityOptions;
      } catch (error) {
        console.warn('Failed to fetch priority options from API, using defaults:', error);
        this.priorityOptions = this.defaultPriorityOptions;
      }
    }
    return this.priorityOptions;
  }

  async getAllowedRoles(): Promise<UserRole[]> {
    if (this.allowedRoles.length === 0) {
      try {
        const response = await api.get('/config/allowed-roles');
        this.allowedRoles = response.data || this.defaultAllowedRoles;
      } catch (error) {
        console.warn('Failed to fetch allowed roles from API, using defaults:', error);
        this.allowedRoles = this.defaultAllowedRoles;
      }
    }
    return this.allowedRoles;
  }

  async getSafetyChecklistItems(): Promise<Array<{key: string, label: string}>> {
    if (this.safetyChecklistItems.length === 0) {
      try {
        const response = await api.get('/config/safety-checklist');
        this.safetyChecklistItems = response.data || this.defaultSafetyChecklistItems;
      } catch (error) {
        console.warn('Failed to fetch safety checklist from API, using defaults:', error);
        this.safetyChecklistItems = this.defaultSafetyChecklistItems;
      }
    }
    return this.safetyChecklistItems;
  }

  async refreshData(): Promise<void> {
    try {
      const [piroguesResponse, locationsResponse, interventionTypesResponse, motorBrandsResponse, priorityOptionsResponse, allowedRolesResponse, safetyChecklistResponse] = await Promise.all([
        api.get('/config/pirogues'),
        api.get('/config/locations'),
        api.get('/config/intervention-types'),
        api.get('/config/motor-brands'),
        api.get('/config/priority-options'),
        api.get('/config/allowed-roles'),
        api.get('/config/safety-checklist')
      ]);
      
      this.pirogues = piroguesResponse.data || this.defaultPirogues;
      this.locations = locationsResponse.data || this.defaultLocations;
      this.interventionTypes = interventionTypesResponse.data || this.defaultInterventionTypes;
      this.motorBrands = motorBrandsResponse.data || this.defaultMotorBrands;
      this.priorityOptions = priorityOptionsResponse.data || this.defaultPriorityOptions;
      this.allowedRoles = allowedRolesResponse.data || this.defaultAllowedRoles;
      this.safetyChecklistItems = safetyChecklistResponse.data || this.defaultSafetyChecklistItems;
    } catch (error) {
      console.warn('Failed to fetch config data from API, using defaults:', error);
      this.pirogues = this.defaultPirogues;
      this.locations = this.defaultLocations;
      this.interventionTypes = this.defaultInterventionTypes;
      this.motorBrands = this.defaultMotorBrands;
      this.priorityOptions = this.defaultPriorityOptions;
      this.allowedRoles = this.defaultAllowedRoles;
      this.safetyChecklistItems = this.defaultSafetyChecklistItems;
    }
  }
}

export const configServiceInstance = ConfigService.getInstance();
export default ConfigService;