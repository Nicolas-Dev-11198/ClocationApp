import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Ship,
  Users,
  Wrench,
  BookOpen,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logbook, MaintenanceSheet } from '../../types';
import { Logbook as ApiLogbook, Maintenance } from '../../types/api';
import { logbookService, maintenanceService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AccessDenied } from '../Common/PermissionGuard';
import ExportButton from '../ExportButton';

type ReportType = 'overview' | 'logbooks' | 'maintenance' | 'users';

const ReportsManager: React.FC = () => {
  const { user } = useAuth();
  const permissions = usePermissions();

  // Check if user has permission to view reports
  if (!permissions.canViewReports) {
    return <AccessDenied />;
  }
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState<'overview' | 'logbooks' | 'maintenance' | 'hr'>('overview');
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [maintenanceSheets, setMaintenanceSheets] = useState<MaintenanceSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      
      // Load logbooks only if user has permission
      if (permissions.canManageLogbook) {
        try {
          const logbooksResponse = await logbookService.getLogbooks();
          const logbooksData = logbooksResponse.data || logbooksResponse;
          setLogbooks(logbooksData.map((lb: ApiLogbook) => ({
            ...lb,
            date: new Date(lb.date),
            createdAt: new Date(lb.created_at || lb.createdAt)
          })));
        } catch (error) {
          console.error('Failed to load logbooks:', error);
          setLogbooks([]);
        }
      } else {
        setLogbooks([]);
      }
      
      // Load maintenance sheets only if user has permission
      if (permissions.canManageMaintenance) {
        try {
          const maintenanceResponse = await maintenanceService.getMaintenanceSheets();
          const maintenanceData = maintenanceResponse.data || maintenanceResponse;
          setMaintenanceSheets(maintenanceData.map((sheet: Maintenance) => ({
            ...sheet,
            interventionDate: new Date(sheet.interventionDate),
            createdAt: new Date(sheet.created_at || sheet.createdAt)
          })));
        } catch (error) {
          console.error('Failed to load maintenance sheets:', error);
          setMaintenanceSheets([]);
        }
      } else {
        setMaintenanceSheets([]);
      }
    } catch (error) {
      console.error('Failed to load reports data:', error);
      showToast('error', 'Erreur lors du chargement des données de rapport');
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDateRange = <T extends { date?: Date; interventionDate?: Date; createdAt: Date }>(data: T[]) => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    return data.filter(item => {
      const itemDate = item.date || item.interventionDate || item.createdAt;
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredLogbooks = filterDataByDateRange(logbooks);
  const filteredMaintenanceSheets = filterDataByDateRange(maintenanceSheets);

  const getOverviewStats = () => {
    const totalTrips = filteredLogbooks.reduce((sum, lb) => sum + lb.trips.length, 0);
    const validatedLogbooks = filteredLogbooks.filter(lb => lb.pilotValidated && lb.logisticsValidated).length;
    const pendingLogbooks = filteredLogbooks.filter(lb => !lb.pilotValidated || !lb.logisticsValidated).length;
    const mechanicalIssues = filteredLogbooks.filter(lb => lb.mechanicalIntervention).length;
    
    const completedMaintenance = filteredMaintenanceSheets.filter(ms => 
      ms.mechanicValidated && ms.pilotValidated && ms.hseValidated
    ).length;
    const pendingMaintenance = filteredMaintenanceSheets.filter(ms => 
      !ms.mechanicValidated || !ms.pilotValidated || !ms.hseValidated
    ).length;

    const activePirogues = new Set([
      ...filteredLogbooks.map(lb => lb.pirogue),
      ...filteredMaintenanceSheets.map(ms => ms.pirogue)
    ]).size;

    return {
      totalTrips,
      validatedLogbooks,
      pendingLogbooks,
      mechanicalIssues,
      completedMaintenance,
      pendingMaintenance,
      activePirogues,
      totalLogbooks: filteredLogbooks.length,
      totalMaintenance: filteredMaintenanceSheets.length
    };
  };

  const stats = getOverviewStats();



  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des données de rapport...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600 mt-1">Analyses et statistiques d'activité</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de rapport
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option key="overview" value="overview">Vue d'ensemble</option>
              {permissions.canManageLogbook && (
                <option key="logbooks" value="logbooks">Carnets de bord</option>
              )}
              {permissions.canManageMaintenance && (
                <option key="maintenance" value="maintenance">Maintenance</option>
              )}
              {permissions.canManageUsers && (
                <option key="hr" value="hr">Ressources humaines</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      {reportType === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Trajets totaux"
              value={stats.totalTrips}
              icon={Ship}
              color="bg-blue-500"
              subtitle="Période sélectionnée"
            />
            <StatCard
              title="Pirogues actives"
              value={stats.activePirogues}
              icon={BarChart3}
              color="bg-green-500"
              subtitle="Utilisées"
            />
            <StatCard
              title="Carnets validés"
              value={stats.validatedLogbooks}
              icon={CheckCircle}
              color="bg-emerald-500"
              subtitle={`/${stats.totalLogbooks} total`}
            />
            <StatCard
              title="Alertes maintenance"
              value={stats.mechanicalIssues}
              icon={AlertTriangle}
              color="bg-red-500"
              subtitle="Signalées"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logbooks Summary */}
            {permissions.canManageLogbook && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Carnets de bord
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total créés</span>
                    <span className="font-medium">{stats.totalLogbooks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Validés</span>
                    <span className="font-medium text-green-600">{stats.validatedLogbooks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En attente</span>
                    <span className="font-medium text-yellow-600">{stats.pendingLogbooks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avec problème mécanique</span>
                    <span className="font-medium text-red-600">{stats.mechanicalIssues}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Summary */}
            {permissions.canManageMaintenance && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                  Maintenance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total interventions</span>
                    <span className="font-medium">{stats.totalMaintenance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Terminées</span>
                    <span className="font-medium text-green-600">{stats.completedMaintenance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En cours</span>
                    <span className="font-medium text-yellow-600">{stats.pendingMaintenance}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Logbooks Report */}
      {reportType === 'logbooks' && permissions.canManageLogbook && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Rapport des carnets de bord</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <ExportButton 
                type="logbooks" 
                filters={{
                  startDate,
                  endDate,
                  status: statusFilter !== 'all' ? statusFilter : undefined
                }}
                className="text-sm"
              >
                Exporter
              </ExportButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Pirogue</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Pilote</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Trajets</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogbooks.map((logbook) => (
                  <tr key={logbook.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{logbook.date.toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{logbook.pirogue}</td>
                    <td className="px-4 py-3">{logbook.pilot}</td>
                    <td className="px-4 py-3">{logbook.trips.length}</td>
                    <td className="px-4 py-3">
                      {logbook.pilotValidated && logbook.logisticsValidated ? (
                        <span className="text-green-600">Validé</span>
                      ) : (
                        <span className="text-yellow-600">En attente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Report */}
      {reportType === 'maintenance' && permissions.canManageMaintenance && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Rapport de maintenance</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <ExportButton 
                type="maintenances" 
                filters={{
                  startDate,
                  endDate,
                  status: statusFilter !== 'all' ? statusFilter : undefined
                }}
                className="text-sm"
              >
                Exporter
              </ExportButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Pirogue</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Lieu</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMaintenanceSheets.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{sheet.interventionDate.toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{sheet.pirogue}</td>
                    <td className="px-4 py-3 capitalize">{sheet.interventionType}</td>
                    <td className="px-4 py-3">{sheet.location}</td>
                    <td className="px-4 py-3">
                      {sheet.mechanicValidated && sheet.pilotValidated && sheet.hseValidated ? (
                        <span className="text-green-600">Validé</span>
                      ) : (
                        <span className="text-yellow-600">En cours</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HR Report */}
      {reportType === 'hr' && permissions.canManageUsers && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Rapport RH</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <ExportButton 
                type="users" 
                filters={{
                  startDate,
                  endDate
                }}
                className="text-sm"
              >
                Exporter
              </ExportButton>
            </div>
          </div>

          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rapport RH</h3>
            <p className="text-gray-500 mb-4">
              Cette section affichera les statistiques du personnel, les expirations de documents, 
              et les données de conformité RH.
            </p>
            <p className="text-sm text-gray-400">
              Fonctionnalité à développer avec les données utilisateurs complètes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManager;