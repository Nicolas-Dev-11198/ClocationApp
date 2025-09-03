import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { UserPermissions } from '../../types';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: keyof UserPermissions;
  requiredRole?: string;
  fallback?: React.ReactNode;
  requireApproval?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  requiredRole,
  fallback = null,
  requireApproval = true
}) => {
  const permissions = usePermissions();
  
  // Si une permission spécifique est requise
  if (permission && !permissions.hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  // Si un rôle spécifique est requis
  if (requiredRole) {
    // Logique pour vérifier le rôle spécifique
    // Cette logique peut être étendue selon les besoins
  }
  
  return <>{children}</>;
};

export default PermissionGuard;

// Composants de protection spécifiques
export const DirecteurOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canValidateAll" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const RHOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canManageUsers" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const LogisticienOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canCreateBookings" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const PiloteOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canFillLogbook" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const MecanicienOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canFillMaintenance" fallback={fallback}>
    {children}
  </PermissionGuard>
);

// Composant pour afficher un message d'accès refusé
export const AccessDenied: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès refusé</h2>
      <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
    </div>
  </div>
);

// Composant pour les utilisateurs en attente d'approbation
export const PendingApproval: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h2 className="text-2xl font-bold text-yellow-600 mb-2">Compte en attente</h2>
      <p className="text-gray-600">Votre compte est en attente d'approbation par les Ressources Humaines.</p>
      <p className="text-gray-500 mt-2">Vous recevrez une notification une fois votre compte approuvé.</p>
    </div>
  </div>
);