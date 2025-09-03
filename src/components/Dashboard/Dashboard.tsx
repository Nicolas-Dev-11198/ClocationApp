import React, { useState, useEffect } from 'react';
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
import DataTable from '../Common/DataTable';
import { bookingServiceInstance } from '../../services/bookingService';
import { logbookServiceInstance } from '../../services/logbookService';
import { maintenanceServiceInstance } from '../../services/maintenanceService';
import { userServiceInstance } from '../../services/userService';

interface Activity {
  id: string;
  type: 'logbook' | 'maintenance' | 'booking';
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<any>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableTitle, setTableTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    {
      title: 'Pirogues actives',
      value: '0',
      icon: Ship,
      color: 'blue',
      trend: '+0%'
    },
    {
      title: 'Trajets du jour',
      value: '0',
      icon: Calendar,
      color: 'green',
      trend: '+0%'
    },
    {
      title: 'Carnets en attente',
      value: '0',
      icon: BookOpen,
      color: 'yellow',
      trend: '+0%'
    },
    {
      title: 'Alertes maintenance',
      value: '0',
      icon: AlertTriangle,
      color: 'red',
      trend: '+0%'
    }
  ]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Charger les statistiques depuis l'API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Charger les utilisateurs pilotes (pirogues actives)
        const users = await userServiceInstance.getAllUsers();
        const activePilots = Array.isArray(users) ? users.filter(user => user.role === 'pilote' && user.isActive) : [];
        
        // Charger les réservations du jour
        const bookings = await bookingServiceInstance.getAll();
        const todayBookings = Array.isArray(bookings) ? bookings.filter(booking => {
          const bookingDate = new Date(booking.scheduledDate);
          const today = new Date();
          return bookingDate.toDateString() === today.toDateString();
        }) : [];
        
        // Charger les carnets en attente
        const logbooks = await logbookServiceInstance.getAll();
        const pendingLogbooks = Array.isArray(logbooks) ? logbooks.filter(logbook => logbook.status === 'pending') : [];
        
        // Charger les alertes de maintenance
        const maintenances = await maintenanceServiceInstance.getAll();
        const alertMaintenances = Array.isArray(maintenances) ? maintenances.filter(maintenance => 
          !maintenance.mechanicValidated || !maintenance.pilotValidated || !maintenance.hseValidated
        ) : [];
        
        // Mettre à jour les statistiques
        setStats([
          {
            title: 'Pirogues actives',
            value: activePilots.length.toString(),
            icon: Ship,
            color: 'blue',
            trend: '+0%'
          },
          {
            title: 'Trajets du jour',
            value: todayBookings.length.toString(),
            icon: Calendar,
            color: 'green',
            trend: '+0%'
          },
          {
            title: 'Carnets en attente',
            value: pendingLogbooks.length.toString(),
            icon: BookOpen,
            color: 'yellow',
            trend: '+0%'
          },
          {
            title: 'Alertes maintenance',
            value: alertMaintenances.length.toString(),
            icon: AlertTriangle,
            color: 'red',
            trend: '+0%'
          }
        ]);
        
        // Créer les activités récentes à partir des données réelles
        const activities: Activity[] = [];
        
        // Ajouter les derniers carnets validés
        const recentLogbooks = Array.isArray(logbooks) ? logbooks
          .filter(logbook => logbook.status === 'validated')
          .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
          .slice(0, 2) : [];
        
        recentLogbooks.forEach(logbook => {
          activities.push({
            id: `logbook-${logbook.id}`,
            type: 'logbook',
            title: 'Carnet de bord validé',
            description: `Pirogue ${logbook.pirogue} - Pilote ${logbook.pilot}`,
            time: new Date(logbook.updatedAt || logbook.createdAt).toLocaleString('fr-FR'),
            icon: BookOpen
          });
        });
        
        // Ajouter les dernières maintenances
        const recentMaintenances = Array.isArray(maintenances) ? maintenances
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2) : [];
        
        recentMaintenances.forEach(maintenance => {
          activities.push({
            id: `maintenance-${maintenance.id}`,
            type: 'maintenance',
            title: 'Maintenance programmée',
            description: `Pirogue ${maintenance.pirogue} - ${maintenance.workDescription}`,
            time: new Date(maintenance.createdAt).toLocaleString('fr-FR'),
            icon: Wrench
          });
        });
        
        // Ajouter les dernières réservations
        const recentBookings = Array.isArray(bookings) ? bookings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2) : [];
        
        recentBookings.forEach(booking => {
          activities.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            title: 'Nouvelle réservation',
            description: `${booking.departurePoint} vers ${booking.arrivalPoint}`,
            time: new Date(booking.createdAt).toLocaleString('fr-FR'),
            icon: Calendar
          });
        });
        
        // Trier par date et prendre les 4 plus récentes
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivities(activities.slice(0, 4));
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      }
    };
    
    loadDashboardData();
  }, []);



  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleCardClick = async (cardType: string) => {
    setLoading(true);
    setSelectedCard(cardType);
    
    try {
      console.log('Clicking card:', cardType);
      switch (cardType) {
        case 'pirogues':
          console.log('Fetching users...');
          const users = await userServiceInstance.getAllUsers();
          console.log('Users received:', users);
          console.log('Users type:', typeof users, 'Array?', Array.isArray(users));
          const pirogues = Array.isArray(users) ? users.filter(user => user.role === 'pilote') : [];
          console.log('Filtered pirogues:', pirogues);
          setTableData(pirogues);
          setTableColumns([
            { key: 'name', label: 'Nom' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Téléphone' },
            { key: 'status', label: 'Statut', render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs ${
                value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {value === 'active' ? 'Actif' : 'Inactif'}
              </span>
            )}
          ]);
          setTableTitle('Pirogues actives');
          break;
          
        case 'trajets':
          console.log('Fetching bookings...');
          const bookings = await bookingServiceInstance.getAll();
          console.log('Bookings received:', bookings);
          console.log('Bookings type:', typeof bookings, 'Array?', Array.isArray(bookings));
          const todayBookings = Array.isArray(bookings) ? bookings.filter(booking => {
            const bookingDate = new Date(booking.scheduledDate);
            const today = new Date();
            return bookingDate.toDateString() === today.toDateString();
          }) : [];
          setTableData(todayBookings);
          setTableColumns([
            { key: 'pirogue', label: 'Pirogue' },
            { key: 'departurePoint', label: 'Départ' },
            { key: 'arrivalPoint', label: 'Destination' },
            { key: 'scheduledDate', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString('fr-FR') },
            { key: 'passengerCount', label: 'Passagers' },
            { key: 'status', label: 'Statut', render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs ${
                value === 'confirmed' ? 'bg-green-100 text-green-800' : 
                value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {value === 'confirmed' ? 'Confirmé' : value === 'pending' ? 'En attente' : 'Annulé'}
              </span>
            )}
          ]);
          setTableTitle('Trajets du jour');
          break;
          
        case 'carnets':
          console.log('Fetching logbooks...');
          const logbooks = await logbookServiceInstance.getAll();
          console.log('Logbooks received:', logbooks);
          console.log('Logbooks type:', typeof logbooks, 'Array?', Array.isArray(logbooks));
          const pendingLogbooks = Array.isArray(logbooks) ? logbooks.filter(logbook => logbook.status === 'pending') : [];
          setTableData(pendingLogbooks);
          setTableColumns([
            { key: 'pirogue', label: 'Pirogue' },
            { key: 'pilot', label: 'Pilote' },
            { key: 'date', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString('fr-FR') },
            { key: 'trips', label: 'Trajets', render: (value: unknown) => Array.isArray(value) ? value.length : 0 },
            { key: 'status', label: 'Statut', render: (value: string) => (
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                En attente
              </span>
            )}
          ]);
          setTableTitle('Carnets en attente');
          break;
          
        case 'maintenance':
          console.log('Fetching maintenances...');
          const maintenances = await maintenanceServiceInstance.getAll();
          console.log('Maintenances received:', maintenances);
          const alertMaintenances = maintenances.filter(maintenance => 
            !maintenance.mechanicValidated || !maintenance.pilotValidated || !maintenance.hseValidated
          );
          setTableData(alertMaintenances);
          setTableColumns([
            { key: 'pirogue', label: 'Pirogue' },
            { key: 'interventionType', label: 'Type' },
            { key: 'workDescription', label: 'Description' },
            { key: 'interventionDate', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString('fr-FR') },
            { key: 'responsiblePilot', label: 'Pilote responsable' }
          ]);
          setTableTitle('Alertes maintenance');
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data for', cardType, ':', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const closeTable = () => {
    setSelectedCard(null);
    setTableData([]);
    setTableColumns([]);
    setTableTitle('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Bienvenue, {user?.name || user?.fullName || 'Utilisateur'}
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
          const cardType = stat.title === 'Pirogues actives' ? 'pirogues' :
                          stat.title === 'Trajets du jour' ? 'trajets' :
                          stat.title === 'Carnets en attente' ? 'carnets' :
                          stat.title === 'Alertes maintenance' ? 'maintenance' : '';
          
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(cardType)}
            >
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
          <button 
            onClick={() => window.location.hash = '#logbook'}
            className="mt-3 sm:mt-4 bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
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
          <button 
            onClick={() => window.location.hash = '#booking'}
            className="mt-3 sm:mt-4 bg-white text-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors w-full sm:w-auto"
          >
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
          <button 
            onClick={() => window.location.hash = '#maintenance'}
            className="mt-3 sm:mt-4 bg-white text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors w-full sm:w-auto"
          >
            Nouvelle fiche
          </button>
        </div>
      </div>

      {/* DataTable Modal */}
      {selectedCard && (
        <DataTable
          title={tableTitle}
          columns={tableColumns}
          data={tableData}
          onClose={closeTable}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Dashboard;