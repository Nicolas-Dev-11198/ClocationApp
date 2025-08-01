import React from 'react';
import { 
  BookOpen, 
  Wrench, 
  Calendar, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Ship,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Pirogues actives',
      value: '8',
      icon: Ship,
      color: 'blue',
      trend: '+2%'
    },
    {
      title: 'Trajets du jour',
      value: '12',
      icon: Calendar,
      color: 'green',
      trend: '+15%'
    },
    {
      title: 'Carnets en attente',
      value: '3',
      icon: BookOpen,
      color: 'yellow',
      trend: '-5%'
    },
    {
      title: 'Alertes maintenance',
      value: '2',
      icon: AlertTriangle,
      color: 'red',
      trend: '0%'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'logbook',
      title: 'Carnet de bord validé',
      description: 'Pirogue C1 - Pilote Jean Dupont',
      time: 'Il y a 2 heures',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance programmée',
      description: 'Pirogue C3 - Révision moteur',
      time: 'Il y a 4 heures',
      icon: Wrench
    },
    {
      id: 3,
      type: 'booking',
      title: 'Nouveau booking',
      description: 'Transport PAX vers Ombouée',
      time: 'Il y a 6 heures',
      icon: Calendar
    },
    {
      id: 4,
      type: 'user',
      title: 'Nouvel utilisateur',
      description: 'Inscription pilote en attente',
      time: 'Il y a 8 heures',
      icon: Users
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Bienvenue, {user?.fullName}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Dernière mise à jour : {new Date().toLocaleString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${getColorClasses(stat.color)} flex-shrink-0 ml-2`}>
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">{stat.trend}</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2 hidden sm:inline">vs mois dernier</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Activités récentes</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Nouveau carnet</h3>
              <p className="text-blue-100 mt-1 text-sm">Créer un carnet de bord</p>
            </div>
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
          </div>
          <button className="mt-3 sm:mt-4 bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto">
            Créer maintenant
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Planifier</h3>
              <p className="text-green-100 mt-1 text-sm">Créer un booking</p>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
          </div>
          <button className="mt-3 sm:mt-4 bg-white text-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors w-full sm:w-auto">
            Nouveau booking
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Maintenance</h3>
              <p className="text-orange-100 mt-1 text-sm">Signaler une intervention</p>
            </div>
            <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
          </div>
          <button className="mt-3 sm:mt-4 bg-white text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors w-full sm:w-auto">
            Nouvelle fiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;