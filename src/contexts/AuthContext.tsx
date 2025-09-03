import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService, userService } from '../services/api';
import { useToast } from './ToastContext';
import { handleApiError } from '../utils/errorHandler';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, status: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          // Le backend retourne directement l'utilisateur
          setUser(response);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Ne pas afficher d'erreur au démarrage si le token est invalide
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      // Le backend retourne { success: true, data: { user, token } }
      if (response.success && response.data && response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        showSuccess('Connexion réussie', `Bienvenue ${response.data.user.name}!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      const apiError = handleApiError(error);
      showError('Erreur de connexion', apiError.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Nettoyer d'abord les données locales
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Ensuite appeler l'API pour invalider le token côté serveur
      await authService.logout();
      showSuccess('Déconnexion réussie', 'À bientôt !');
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur API, on considère la déconnexion comme réussie
      // car les données locales ont été nettoyées
      showSuccess('Déconnexion réussie', 'À bientôt !');
    }
  };

  const register = async (fullName: string, password: string, role: string): Promise<boolean> => {
    try {
      // Séparer le nom complet en prénom et nom
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Fonction pour normaliser le texte (supprimer accents et caractères spéciaux)
      const normalizeText = (text: string): string => {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-z0-9\s]/g, '') // Supprimer les caractères spéciaux sauf espaces
          .replace(/\s+/g, '.') // Remplacer espaces par points
          .replace(/\.+/g, '.') // Éviter les points multiples
          .replace(/^\.|\.$/, ''); // Supprimer points en début/fin
      };
      
      // Générer un email basé sur le nom normalisé
      const email = `${normalizeText(fullName)}@clocation.com`;
      
      const response = await authService.register({
        name: fullName,
        firstName,
        lastName,
        email,
        password,
        password_confirmation: password,
        role
      });
      
      if (response.success) {
        showSuccess('Inscription réussie', 'Votre demande d\'inscription a été envoyée pour validation par les Ressources Humaines.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      const apiError = handleApiError(error);
      showError('Erreur d\'inscription', apiError.message);
      return false;
    }
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await authService.updateUserStatus(userId, 'approved');
      if (response.success) {
        showSuccess('Utilisateur approuvé', 'L\'utilisateur a été approuvé avec succès.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Approve user error:', error);
      const apiError = handleApiError(error);
      showError('Erreur d\'approbation', apiError.message);
      return false;
    }
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await authService.updateUserStatus(userId, 'rejected');
      if (response.success) {
        showSuccess('Utilisateur rejeté', 'L\'utilisateur a été rejeté.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Reject user error:', error);
      const apiError = handleApiError(error);
      showError('Erreur de rejet', apiError.message);
      return false;
    }
  };

  const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
    try {
      const response = await authService.updateUserStatus(userId, status);
      if (response.success) {
        showSuccess('Statut mis à jour', 'Le statut de l\'utilisateur a été mis à jour.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user status error:', error);
      const apiError = handleApiError(error);
      showError('Erreur de mise à jour', apiError.message);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = await authService.updateProfile(userData);
      if (updatedUser) {
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        showSuccess('Profil mis à jour', 'Vos informations ont été mises à jour avec succès.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      const apiError = handleApiError(error);
      showError('Erreur de mise à jour du profil', apiError.message);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    approveUser,
    rejectUser,
    updateUserStatus,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};