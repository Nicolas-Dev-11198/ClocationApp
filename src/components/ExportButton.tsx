import React, { useState } from 'react';
import { reportService } from '../services/api';
import { downloadFile, getExportFilename, handleExportError } from '../utils/downloadUtils';
import { ExportFilters } from '../types/api';

interface ExportButtonProps {
  type: 'bookings' | 'logbooks' | 'maintenances' | 'users';
  filters?: ExportFilters;
  className?: string;
  children?: React.ReactNode;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  type, 
  filters = {}, 
  className = '', 
  children 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    setShowFormatMenu(false);
    
    try {
      let blob: Blob;
      
      switch (type) {
        case 'bookings':
          blob = await reportService.exportBookings(format, filters);
          break;
        case 'logbooks':
          blob = await reportService.exportLogbooks(format, filters);
          break;
        case 'maintenances':
          blob = await reportService.exportMaintenances(format, filters);
          break;
        case 'users':
          blob = await reportService.exportUsers(format, filters);
          break;
        default:
          throw new Error('Type d\'export non supporté');
      }
      
      const filename = getExportFilename(type, format);
      downloadFile(blob, filename);
      
    } catch (error) {
      handleExportError(error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowFormatMenu(!showFormatMenu)}
        disabled={isExporting}
        className={`
          inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
          text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Export en cours...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {children || 'Exporter'}
            <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>

      {showFormatMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg className="mr-3 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exporter en Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg className="mr-3 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exporter en PDF
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay pour fermer le menu */}
      {showFormatMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowFormatMenu(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;