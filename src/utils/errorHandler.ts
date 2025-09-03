import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown> | string[] | string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Messages d'erreur personnalisés selon le statut
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Données invalides',
          status,
          code: 'BAD_REQUEST',
          details: data
        };
      case 401:
        return {
          message: 'Session expirée, veuillez vous reconnecter',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: 'Accès refusé',
          status,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: 'Ressource non trouvée',
          status,
          code: 'NOT_FOUND'
        };
      case 409:
        return {
          message: data?.message || 'Conflit de données',
          status,
          code: 'CONFLICT',
          details: data
        };
      case 422:
        return {
          message: data?.message || 'Données de validation incorrectes',
          status,
          code: 'VALIDATION_ERROR',
          details: data
        };
      case 500:
        return {
          message: 'Erreur interne du serveur',
          status,
          code: 'INTERNAL_ERROR'
        };
      case 503:
        return {
          message: 'Service temporairement indisponible',
          status,
          code: 'SERVICE_UNAVAILABLE'
        };
      default:
        if (error.code === 'ECONNABORTED') {
          return {
            message: 'Délai d\'attente dépassé',
            code: 'TIMEOUT'
          };
        }
        if (error.code === 'ERR_NETWORK') {
          return {
            message: 'Erreur de connexion réseau',
            code: 'NETWORK_ERROR'
          };
        }
        return {
          message: data?.message || error.message || 'Une erreur inattendue s\'est produite',
          status,
          code: 'UNKNOWN_ERROR'
        };
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR'
    };
  }
  
  return {
    message: 'Une erreur inattendue s\'est produite',
    code: 'UNKNOWN_ERROR'
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 422 || error.response?.status === 400;
  }
  return false;
};