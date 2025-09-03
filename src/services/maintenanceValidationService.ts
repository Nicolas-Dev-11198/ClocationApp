import api from './api';

export interface MaintenanceValidationRequest {
  validation_type: 'pilot' | 'admin' | 'logistics';
  validated: boolean;
  comments?: string;
}

export interface MaintenanceValidationResponse {
  success: boolean;
  message: string;
  maintenance: any;
}

export const maintenanceValidationService = {
  async validateMaintenance(
    maintenanceId: string,
    validationData: MaintenanceValidationRequest
  ): Promise<MaintenanceValidationResponse> {
    try {
      const response = await api.patch(
        `/maintenances/${maintenanceId}/validate`,
        validationData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la validation du rapport de maintenance'
      );
    }
  },

  async getMaintenanceForValidation(maintenanceId: string) {
    try {
      const response = await api.get(`/maintenances/${maintenanceId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du rapport de maintenance'
      );
    }
  },

  async getPendingMaintenances() {
    try {
      const response = await api.get('/maintenances?status=pending');
      // S'assurer que nous retournons toujours un tableau
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else {
        return [];
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération des rapports en attente'
      );
    }
  }
};