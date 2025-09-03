import React from 'react';
import { 
  BookOpen, 
  Wrench, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  BarChart3,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const permissions = usePermissions();

  console.log('Navigation - User:', user);
  console.log('Navigation - User role:', user?.role);
  console.log('Navigation - Permissions:', permissions);

  if (!user) {
    console.log('Navigation - No user found, returning null');
    return null;
  }

  const getAvailableTabs = () => {
    const tabs = [];

    // Dashboard - accessible à tous
    tabs.push({ id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, shortLabel: 'Dashboard' });

    // Carnet de bord - pilotes et logisticiens
    if (permissions.canManageLogbook) {
      tabs.push({ id: 'logbook', label: 'Carnet de bord', icon: BookOpen, shortLabel: 'Carnet' });
    }

    // Maintenance - mécaniciens et logisticiens
    if (permissions.canManageMaintenance) {
      tabs.push({ id: 'maintenance', label: 'Maintenance', icon: Wrench, shortLabel: 'Maintenance' });
    }

    // Validation des maintenances - pilotes, directeurs et logisticiens
    if (permissions.canValidateMaintenance) {
      tabs.push({ id: 'maintenance-validation', label: 'Validation Maintenance', icon: CheckCircle, shortLabel: 'Validation' });
    }

    // Booking - logisticiens et directeur
    if (permissions.canManageBookings) {
      tabs.push({ id: 'booking', label: 'Booking', icon: Calendar, shortLabel: 'Booking' });
    }

    // Gestion des utilisateurs - directeur seulement
    if (permissions.canManageUsers) {
      tabs.push({ id: 'users', label: 'Utilisateurs', icon: Users, shortLabel: 'Users' });
    }

    // Approbation des utilisateurs - RH seulement
    if (permissions.canApproveUsers) {
      tabs.push({ id: 'user-approval', label: 'Approbations', icon: UserCheck, shortLabel: 'Approb.' });
    }

    // Rapports - tous sauf pilotes et mécaniciens
    if (permissions.canViewReports) {
      tabs.push({ id: 'reports', label: 'Rapports', icon: FileText, shortLabel: 'Rapports' });
    }

    // Profil - accessible à tous
    tabs.push({ id: 'profile', label: 'Profil', icon: Settings, shortLabel: 'Profil' });

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
          {availableTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;