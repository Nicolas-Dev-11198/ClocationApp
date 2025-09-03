import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS, UserPermissions, UserRole } from '../types';

export const usePermissions = (): UserPermissions & { hasPermission: (permission: keyof UserPermissions) => boolean } => {
  const { user } = useAuth();
  
  const defaultPermissions: UserPermissions = {
    canViewAll: false,
    canValidateAll: false,
    canManageUsers: false,
    canCreateBookings: false,
    canFillLogbook: false,
    canValidateLogbook: false,
    canFillMaintenance: false,
    canValidateMaintenance: false,
    canViewReports: false,
    canModifyUsers: false,
    canApproveRegistrations: false,
    canApproveUsers: false,
    canManageLogbook: false,
    canManageMaintenance: false,
    canManageBookings: false
  };

  if (!user || user.status !== 'approved') {
    return {
      ...defaultPermissions,
      hasPermission: () => false
    };
  }

  const userPermissions = ROLE_PERMISSIONS[user.role as UserRole] || defaultPermissions;

  return {
    ...userPermissions,
    hasPermission: (permission: keyof UserPermissions) => userPermissions[permission]
  };
};

export const useRoleCheck = () => {
  const { user } = useAuth();
  
  return {
    isDirecteur: user?.role === 'director' && user?.status === 'approved',
    isPilote: user?.role === 'pilote' && user?.status === 'approved',
    isMecanicien: user?.role === 'mecanicien' && user?.status === 'approved',
    isLogisticien: user?.role === 'logisticien' && user?.status === 'approved',
    isRH: user?.role === 'rh' && user?.status === 'approved',
    isApproved: user?.status === 'approved',
    isPending: user?.status === 'pending',
    userRole: user?.role as UserRole
  };
};