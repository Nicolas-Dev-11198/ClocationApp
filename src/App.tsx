import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return showRegister ? (
      <RegisterForm onShowLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onShowRegister={() => setShowRegister(true)} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'logbook':
        return <LogbookManager />;
      case 'maintenance':
        return <MaintenanceManager />;
      case 'booking':
        return <BookingManager />;
      case 'users':
        return <UsersManager />;
      case 'reports':
        return <ReportsManager />;
      case 'profile':
        return <ProfileManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;