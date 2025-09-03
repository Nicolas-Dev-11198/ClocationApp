import React, { useState, useEffect } from 'react';
import { User, STATUS_LABELS, ROLE_LABELS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { userServiceInstance as userService } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AccessDenied } from '../Common/PermissionGuard';

const UserApprovalManager: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const { approveUser, rejectUser, updateUserStatus } = useAuth();
  const { showError, showSuccess } = useToast();
  const permissions = usePermissions();

  // Check if user has permission to manage users
  if (!permissions.canApproveUsers && !permissions.canManageUsers) {
    return <AccessDenied />;
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      setPendingUsers(users.filter(user => user.status === 'pending'));
      setAllUsers(users);
    } catch (error) {
      showError('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!permissions.canApproveUsers) return;
    const success = await approveUser(userId);
    if (success) {
      await loadUsers();
    }
  };

  const handleReject = async (userId: string) => {
    if (!permissions.canApproveUsers) return;
    const success = await rejectUser(userId);
    if (success) {
      await loadUsers();
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!permissions.canManageUsers) return;
    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      await loadUsers();
    }
  };

  const UserCard: React.FC<{ user: User; showActions?: boolean }> = ({ user, showActions = true }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="mt-2 space-y-1">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              user.role === 'directeur' ? 'bg-purple-100 text-purple-800' :
              user.role === 'rh' ? 'bg-blue-100 text-blue-800' :
              user.role === 'logisticien' ? 'bg-green-100 text-green-800' :
              user.role === 'pilote' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ROLE_LABELS[user.role]}
            </span>
            <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${
              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              user.status === 'approved' ? 'bg-green-100 text-green-800' :
              user.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {STATUS_LABELS[user.status || 'pending']}
            </span>
          </div>
          {user.department && (
            <p className="text-sm text-gray-500 mt-1">Département: {user.department}</p>
          )}
          {user.position && (
            <p className="text-sm text-gray-500">Poste: {user.position}</p>
          )}
          {user.createdAt && (
            <p className="text-sm text-gray-500 mt-2">
              Inscrit le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
        
        {showActions && user.status === 'pending' && permissions.canApproveUsers && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => handleApprove(user.id)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Approuver
            </button>
            <button
              onClick={() => handleReject(user.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Rejeter
            </button>
          </div>
        )}
        
        {showActions && user.status !== 'pending' && permissions.canManageUsers && (
          <div className="ml-4">
            <select
              value={user.status || 'pending'}
              onChange={(e) => handleStatusChange(user.id, e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option key="approved" value="approved">Approuvé</option>
              <option key="rejected" value="rejected">Rejeté</option>
              <option key="active" value="active">Actif</option>
              <option key="inactive" value="inactive">Inactif</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            En attente ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tous les utilisateurs ({allUsers.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeTab === 'pending' ? (
            pendingUsers.length > 0 ? (
              pendingUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur en attente d'approbation
              </div>
            )
          ) : (
            allUsers.length > 0 ? (
              allUsers.map(user => (
                <UserCard key={user.id} user={user} showActions={user.status !== 'approved'} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur trouvé
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default UserApprovalManager;