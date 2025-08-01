import React from 'react';
import { LogOut, User, Anchor, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Anchor className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">CLOCATION</h1>
              <p className="text-blue-200 text-xs sm:text-sm hidden sm:block">Gestion de Flotte de Pirogues</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200" />
                <div className="text-right">
                  <p className="font-medium text-sm sm:text-base">{user.fullName}</p>
                  <p className="text-xs sm:text-sm text-blue-200">{ROLE_LABELS[user.role]}</p>
                </div>
              </div>
              
              {/* Mobile user info */}
              <div className="sm:hidden flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-200" />
                <span className="text-sm font-medium">{user.fullName.split(' ')[0]}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-blue-800 hover:bg-blue-600 transition-colors text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;