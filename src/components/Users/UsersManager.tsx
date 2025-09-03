import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Edit, 
  Check, 
  X, 
  Calendar,
  FileText,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { User, ROLE_LABELS } from '../../types';
import { HRData, PaginatedResponse } from '../../types/api';
import { userService } from '../../services/api';
import Pagination from '../common/Pagination';
import { useToast } from '../../contexts/ToastContext';

type UserFilter = 'all' | 'active' | 'pending' | 'inactive';

const UsersManager: React.FC = () => {
  const { user: currentUser } = useAuth();
  const permissions = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
    from: 0,
    to: 0
  });
  const { showToast } = useToast();
  const [hrFormData, setHrFormData] = useState({
    contractStart: '',
    contractEnd: '',
    medicalVisitStart: '',
    medicalVisitEnd: '',
    derogationStart: '',
    derogationEnd: '',
    inductionStart: '',
    inductionEnd: '',
    cnssNumber: '',
    payrollNumber: ''
  });

  const loadUsers = async (page: number = 1, perPage: number = 5, currentFilter: UserFilter = filter, currentSearch: string = searchTerm) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: perPage,
        ...(currentFilter !== 'all' && { status: currentFilter }),
        ...(currentSearch && { search: currentSearch })
      };
      const response: PaginatedResponse<User> = await userService.getAll(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast('error', 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      await userService.updateUserStatus(parseInt(userId), status);
      showToast('success', 'Statut utilisateur mis à jour');
      loadUsers(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Failed to update user status:', error);
      showToast('error', 'Erreur lors de la mise à jour du statut');
    }
  };

  const saveHRData = async (userId: string, hrData: HRData) => {
    try {
      await userService.updateUser(userId, { hrData });
      showToast('success', 'Données RH sauvegardées');
      loadUsers(pagination.current_page, pagination.per_page);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save HR data:', error);
      showToast('error', 'Erreur lors de la sauvegarde des données RH');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers(1, pagination.per_page, filter, searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filter]);

  const handleApproveUser = async (userId: string) => {
    if (!permissions.canApproveUsers) return;
    await updateUserStatus(userId, 'approved');
  };

  const handleRejectUser = async (userId: string) => {
    if (!permissions.canApproveUsers) return;
    await updateUserStatus(userId, 'rejected');
  };

  const handlePageChange = (page: number) => {
    loadUsers(page, pagination.per_page, filter, searchTerm);
  };

  const handlePerPageChange = (perPage: number) => {
    loadUsers(1, perPage, filter, searchTerm);
  };

  const handleEditHRData = (user: User) => {
    if (!permissions.canManageUsers) return;
    setEditingUser(user);
    setHrFormData({
      contractStart: user.hrData?.contractStart ? new Date(user.hrData.contractStart).toISOString().split('T')[0] : '',
      contractEnd: user.hrData?.contractEnd ? new Date(user.hrData.contractEnd).toISOString().split('T')[0] : '',
      medicalVisitStart: user.hrData?.medicalVisitStart ? new Date(user.hrData.medicalVisitStart).toISOString().split('T')[0] : '',
      medicalVisitEnd: user.hrData?.medicalVisitEnd ? new Date(user.hrData.medicalVisitEnd).toISOString().split('T')[0] : '',
      derogationStart: user.hrData?.derogationStart ? new Date(user.hrData.derogationStart).toISOString().split('T')[0] : '',
      derogationEnd: user.hrData?.derogationEnd ? new Date(user.hrData.derogationEnd).toISOString().split('T')[0] : '',
      inductionStart: user.hrData?.inductionStart ? new Date(user.hrData.inductionStart).toISOString().split('T')[0] : '',
      inductionEnd: user.hrData?.inductionEnd ? new Date(user.hrData.inductionEnd).toISOString().split('T')[0] : '',
      cnssNumber: user.hrData?.cnssNumber || '',
      payrollNumber: user.hrData?.payrollNumber || ''
    });
  };

  const handleSaveHRData = async () => {
    if (!editingUser || !permissions.canManageUsers) return;

    const hrData = {
      contractStart: hrFormData.contractStart ? new Date(hrFormData.contractStart) : undefined,
      contractEnd: hrFormData.contractEnd ? new Date(hrFormData.contractEnd) : undefined,
      medicalVisitStart: hrFormData.medicalVisitStart ? new Date(hrFormData.medicalVisitStart) : undefined,
      medicalVisitEnd: hrFormData.medicalVisitEnd ? new Date(hrFormData.medicalVisitEnd) : undefined,
      derogationStart: hrFormData.derogationStart ? new Date(hrFormData.derogationStart) : undefined,
      derogationEnd: hrFormData.derogationEnd ? new Date(hrFormData.derogationEnd) : undefined,
      inductionStart: hrFormData.inductionStart ? new Date(hrFormData.inductionStart) : undefined,
      inductionEnd: hrFormData.inductionEnd ? new Date(hrFormData.inductionEnd) : undefined,
      cnssNumber: hrFormData.cnssNumber,
      payrollNumber: hrFormData.payrollNumber
    };

    await saveHRData(editingUser.id, hrData);
  };

  const getExpirationWarnings = (user: User) => {
    if (!user.hrData) return [];
    
    const warnings = [];
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const checkExpiration = (date: Date | undefined, label: string) => {
      if (date && new Date(date) <= tenDaysFromNow) {
        warnings.push({
          label,
          date: new Date(date),
          isExpired: new Date(date) < now
        });
      }
    };

    checkExpiration(user.hrData.contractEnd, 'Contrat');
    checkExpiration(user.hrData.medicalVisitEnd, 'Visite médicale');
    checkExpiration(user.hrData.derogationEnd, 'Dérogation');
    checkExpiration(user.hrData.inductionEnd, 'Induction');

    return warnings;
  };

  // Les utilisateurs sont déjà filtrés côté serveur
  const filteredUsers = users;

  if (!permissions.canManageUsers) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
        <p className="text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette section.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les comptes et les données RH</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, email, rôle..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Filtrer par statut
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as UserFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option key="all" value="all">Tous</option>
              <option key="active" value="active">Actifs</option>
              <option key="pending" value="pending">En attente</option>
              <option key="inactive" value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredUsers.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <Users className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur ne correspond aux critères de recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile view */}
            <div className="block sm:hidden">
              {filteredUsers.map((user) => {
                const warnings = getExpirationWarnings(user);
                return (
                  <div key={user.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{user.fullName}</span>
                          {warnings.length > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{ROLE_LABELS[user.role]}</p>
                        <p className="text-sm text-gray-600">{user.email || 'Email non renseigné'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    {warnings.length > 0 && (
                      <div className="mb-3 p-2 bg-yellow-50 rounded text-xs">
                        <p className="text-yellow-700 font-medium">Alertes d'expiration:</p>
                        {warnings.map((warning, idx) => (
                          <p key={idx} className="text-yellow-600">
                            {warning.label}: {warning.date ? new Date(warning.date).toLocaleDateString('fr-FR') : 'Non renseigné'}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Inscrit le {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non renseigné'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {!user.isActive && user.id !== '1' && (
                          <>
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEditHRData(user)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop view */}
            <table className="w-full hidden sm:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alertes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const warnings = getExpirationWarnings(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email || 'Email non renseigné'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ROLE_LABELS[user.role]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non renseigné'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {warnings.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs text-yellow-600">{warnings.length}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Aucune</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {!user.isActive && user.id !== '1' && permissions.canApproveUsers && (
                            <>
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approuver"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Rejeter"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {permissions.canManageUsers && (
                            <button
                              onClick={() => handleEditHRData(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Modifier données RH"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          </div>
        )}
      </div>

      {/* HR Data Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Données RH - {editingUser.fullName}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Contract */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Contrat
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={hrFormData.contractStart}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, contractStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={hrFormData.contractEnd}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, contractEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Visit */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Visite médicale
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={hrFormData.medicalVisitStart}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, medicalVisitStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={hrFormData.medicalVisitEnd}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, medicalVisitEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Derogation */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Dérogation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={hrFormData.derogationStart}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, derogationStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={hrFormData.derogationEnd}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, derogationEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Induction */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Induction</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={hrFormData.inductionStart}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, inductionStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={hrFormData.inductionEnd}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, inductionEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Numbers */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Numéros</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro CNSS
                    </label>
                    <input
                      type="text"
                      value={hrFormData.cnssNumber}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, cnssNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Numéro CNSS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de paie
                    </label>
                    <input
                      type="text"
                      value={hrFormData.payrollNumber}
                      onChange={(e) => setHrFormData(prev => ({ ...prev, payrollNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Numéro de paie"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setEditingUser(null)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveHRData}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;