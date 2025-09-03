import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPerPageChange,
  className = ''
}) => {
  const { current_page, last_page, per_page, total, from, to } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (last_page <= maxVisiblePages) {
      // Si on a moins de 5 pages, on les affiche toutes
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec des ellipses
      if (current_page <= 3) {
        // Début: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(last_page);
      } else if (current_page >= last_page - 2) {
        // Fin: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = last_page - 3; i <= last_page; i++) {
          pages.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(last_page);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== current_page) {
      onPageChange(page);
    }
  };

  if (last_page <= 1) {
    return null; // Ne pas afficher la pagination s'il n'y a qu'une page
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Informations sur les résultats */}
      <div className="text-sm text-gray-700">
        Affichage de {from || 1} à {to || total} sur {total} résultats
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center space-x-2">
        {/* Sélecteur du nombre d'éléments par page */}
        {onPerPageChange && (
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm text-gray-700">Afficher:</span>
            <select
              value={per_page}
              onChange={(e) => onPerPageChange(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option key="10" value={10}>10</option>
            <option key="25" value={25}>25</option>
            <option key="50" value={50}>50</option>
            <option key="100" value={100}>100</option>
            </select>
          </div>
        )}

        {/* Bouton Précédent */}
        <button
          onClick={() => handlePageClick(current_page - 1)}
          disabled={current_page === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Précédent</span>
        </button>

        {/* Numéros de page */}
        <div className="flex">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page === '...'}
              className={`px-3 py-2 text-sm font-medium border-t border-b border-r first:border-l ${
                page === current_page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : page === '...'
                  ? 'bg-white text-gray-400 cursor-default'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => handlePageClick(current_page + 1)}
          disabled={current_page === last_page}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline mr-1">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
export type { PaginationProps };