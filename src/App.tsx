import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import LogbookManager from './components/Logbook/LogbookManager';
import MaintenanceManager from './components/Maintenance/MaintenanceManager';
import BookingManager from './components/Booking/BookingManager';
import ProfileManager from './components/Profile/ProfileManager';
import ReportsManager from './components/Reports/ReportsManager';
import UsersManager from './components/Users/UsersManager';
import UserApprovalManager from './components/Users/UserApprovalManager';
import PendingMaintenanceList from './components/Maintenance/PendingMaintenanceList';
import { usePermissions } from './hooks/usePermissions';
import { PendingApproval, AccessDenied } from './components/Common/PermissionGuard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const permissions = usePermissions();

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash && ['dashboard', 'logbook', 'maintenance', 'maintenance-validation', 'booking', 'users', 'reports', 'profile', 'user-approval'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = `#${tab}`;
  };

  console.log('App - User:', user);
  console.log('App - Show register:', showRegister);

  if (!user) {
    console.log('App - No user, showing login/register form');
    return showRegister ? (
      <RegisterForm onShowLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onShowRegister={() => setShowRegister(true)} />
    );
  }

  // Vérifier si l'utilisateur est en attente d'approbation
  if (user.status === 'pending') {
    return <PendingApproval />;
  }

  // Vérifier si l'utilisateur est rejeté ou inactif
  if (user.status === 'rejected' || user.status === 'inactive') {
    return <AccessDenied />;
  }

  console.log('App - User authenticated, showing main app with navigation');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'logbook':
        return <LogbookManager />;
      case 'maintenance':
        return <MaintenanceManager />;
      case 'maintenance-validation':
        return permissions.canValidateMaintenance ? <PendingMaintenanceList /> : <AccessDenied />;
      case 'booking':
        return <BookingManager />;
      case 'users':
        return permissions.canManageUsers ? <UsersManager /> : <AccessDenied />;
      case 'user-approval':
        return <UserApprovalManager />;
      case 'reports':
        return permissions.canViewReports ? <ReportsManager /> : <AccessDenied />;
      case 'profile':
        return <ProfileManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;