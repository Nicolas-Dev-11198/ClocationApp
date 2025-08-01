import React from 'react';
import { 
  BookOpen, 
  Wrench, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, shortLabel: 'Dashboard' },
      { id: 'logbook', label: 'Carnet de bord', icon: BookOpen, shortLabel: 'Carnet' },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench, shortLabel: 'Maintenance' },
      { id: 'booking', label: 'Booking', icon: Calendar, shortLabel: 'Booking' },
      { id: 'users', label: 'Utilisateurs', icon: Users, shortLabel: 'Users' },
      { id: 'reports', label: 'Rapports', icon: FileText, shortLabel: 'Rapports' },
      { id: 'profile', label: 'Profil', icon: Settings, shortLabel: 'Profil' }
    ];

    // Filter tabs based on user role
    switch (user.role) {
      case 'directeur':
        return allTabs;
      case 'drh':
        return allTabs.filter(tab => 
          ['dashboard', 'users', 'reports', 'profile'].includes(tab.id)
        );
      case 'responsable_logistique':
        return allTabs.filter(tab => 
          ['dashboard', 'logbook', 'booking', 'reports', 'profile'].includes(tab.id)
        );
      case 'pilote':
        return allTabs.filter(tab => 
          ['dashboard', 'logbook', 'profile'].includes(tab.id)
        );
      case 'mecanicien':
        return allTabs.filter(tab => 
          ['dashboard', 'maintenance', 'profile'].includes(tab.id)
        );
      default:
        return [allTabs[0], allTabs[allTabs.length - 1]]; // dashboard and profile
    }
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