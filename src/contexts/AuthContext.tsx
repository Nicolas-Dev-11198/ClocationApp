import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (fullName: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, password: string, role: UserRole) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  getAllUsers: () => User[];
  updateUserStatus: (userId: string, isActive: boolean) => void;
  updateUserHRData: (userId: string, hrData: Partial<User['hrData']>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to convert date strings back to Date objects
const convertDatesToObjects = (user: any): User => {
  const convertedUser = { ...user };
  
  // Convert createdAt
  if (convertedUser.createdAt && typeof convertedUser.createdAt === 'string') {
    convertedUser.createdAt = new Date(convertedUser.createdAt);
  }
  
  // Convert dates in hrData
  if (convertedUser.hrData) {
    const dateFields = [
      'contractStart', 'contractEnd', 'medicalVisitStart', 'medicalVisitEnd',
      'derogationStart', 'derogationEnd', 'inductionStart', 'inductionEnd'
    ];
    
    dateFields.forEach(field => {
      if (convertedUser.hrData[field] && typeof convertedUser.hrData[field] === 'string') {
        convertedUser.hrData[field] = new Date(convertedUser.hrData[field]);
      }
    });
  }
  
  return convertedUser;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('clocation_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const convertedUsers = parsedUsers.map(convertDatesToObjects);
      setUsers(convertedUsers);
    } else {
      // Initialize with default admin user
      const defaultUsers: User[] = [
        {
          id: '1',
          fullName: 'Admin CLOCATION',
          email: 'admin@clocation.com',
          role: 'directeur',
          isActive: true,
          createdAt: new Date(),
          hrData: {}
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('clocation_users', JSON.stringify(defaultUsers));
    }

    // Check for saved session
    const savedUser = localStorage.getItem('clocation_current_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const convertedUser = convertDatesToObjects(parsedUser);
      setUser(convertedUser);
    }
  }, []);

  const login = async (fullName: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would be server-side
    const foundUser = users.find(u => 
      u.fullName.toLowerCase() === fullName.toLowerCase() && 
      u.isActive
    );
    
    if (foundUser && password === 'password123') { // Simple password for demo
      setUser(foundUser);
      localStorage.setItem('clocation_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clocation_current_user');
  };

  const register = async (fullName: string, password: string, role: UserRole): Promise<boolean> => {
    // Check if user already exists
    const existingUser = users.find(u => u.fullName.toLowerCase() === fullName.toLowerCase());
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      role,
      isActive: false, // Requires HR approval
      createdAt: new Date(),
      hrData: {}
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('clocation_users', JSON.stringify(updatedUsers));
    
    // Notify HR (in production, this would be an actual notification)
    console.log('HR notification: New user registration pending approval');
    
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('clocation_current_user', JSON.stringify(updatedUser));
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('clocation_users', JSON.stringify(updatedUsers));
  };

  const getAllUsers = () => users;

  const updateUserStatus = (userId: string, isActive: boolean) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('clocation_users', JSON.stringify(updatedUsers));
  };

  const updateUserHRData = (userId: string, hrData: Partial<User['hrData']>) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, hrData: { ...u.hrData, ...hrData } } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('clocation_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateUser,
      getAllUsers,
      updateUserStatus,
      updateUserHRData
    }}>
      {children}
    </AuthContext.Provider>
  );
};