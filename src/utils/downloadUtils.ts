export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getExportFilename = (type: string, format: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const extension = format === 'pdf' ? 'pdf' : 'xlsx';
  
  const typeNames: { [key: string]: string } = {
    bookings: 'reservations',
    logbooks: 'carnets_de_bord',
    maintenances: 'maintenances',
    users: 'utilisateurs'
  };
  
  const typeName = typeNames[type] || type;
  return `${typeName}_${timestamp}.${extension}`;
};

interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  message?: string;
}

export const handleExportError = (error: ApiError | Error | unknown) => {
  console.error('Export error:', error);
  
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError;
    if (apiError.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    } else if (apiError.response?.status === 403) {
      throw new Error('Vous n\'avez pas les permissions pour effectuer cette action.');
    } else if (apiError.response?.status === 500) {
      throw new Error('Erreur serveur lors de l\'export. Veuillez réessayer.');
    }
  }
  
  throw new Error('Erreur lors de l\'export. Veuillez réessayer.');
};