import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { handleApiError, isNetworkError } from '../utils/errorHandler';

interface UseApiCallOptions<T> {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface UseApiCallReturn<T, TArgs extends unknown[] = unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: TArgs) => Promise<T | null>;
  reset: () => void;
}

export const useApiCall = <T = unknown, TArgs extends unknown[] = unknown[]>(
  apiFunction: (...args: TArgs) => Promise<T>,
  options: UseApiCallOptions<T> = {}
): UseApiCallReturn<T, TArgs> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const {
    showSuccessToast = false,
    successMessage = 'Opération réussie',
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  const execute = useCallback(async (...args: TArgs): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      
      if (showErrorToast) {
        if (isNetworkError(err)) {
          showError(
            'Erreur de connexion',
            'Vérifiez votre connexion internet et réessayez'
          );
        } else {
          showError('Erreur', apiError.message);
        }
      }
      
      if (onError) {
        onError(apiError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showSuccessToast, successMessage, showErrorToast, showSuccess, showError, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

export default useApiCall;