import { userService, authService } from './api';
import { User, UserRole } from '../types';

export class UserService {
  private static instance: UserService;
  private users: User[] = [];
  private initialized = false;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const response = await userService.getAll();
      this.users = response.data || response.users || response || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize user service:', error);
      this.users = [];
      this.initialized = true;
    }
  }

  async getAllUsers(perPage: number = 1000): Promise<User[]> {
    try {
      const response = await userService.getAll({ per_page: perPage });
      // Handle paginated response
      if (response.data && Array.isArray(response.data)) {
        this.users = response.data;
      } else if (response.users && Array.isArray(response.users)) {
        this.users = response.users;
      } else if (Array.isArray(response)) {
        this.users = response;
      } else {
        this.users = [];
      }
      return this.users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return this.users;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      // Utiliser le service d'authentification pour créer un utilisateur
      const response = await authService.register({
        name: userData.name,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email,
        password: userData.password || 'defaultPassword123',
        password_confirmation: userData.password || 'defaultPassword123',
        role: userData.role,
        phone: userData.phone,
        department: userData.department,
        position: userData.position
      });
      const newUser = response.user;
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await userService.updateUser(id, userData);
      const updatedUser = response.user;
      
      const index = this.users.findIndex(u => u.id === id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: string): Promise<User> {
    try {
      const response = await userService.updateUserStatus(parseInt(userId), status);
      const updatedUser = response.user || response;
      
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], status, isActive: status === 'active' };
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  }

  async approveUser(userId: string): Promise<User> {
    try {
      const response = await userService.approveUser(parseInt(userId));
      const updatedUser = response.user || response;
      
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], status: 'approved', isActive: true };
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to approve user:', error);
      throw error;
    }
  }

  async rejectUser(userId: string): Promise<User> {
    try {
      const response = await userService.rejectUser(parseInt(userId));
      const updatedUser = response.user || response;
      
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], status: 'rejected', isActive: false };
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to reject user:', error);
      throw error;
    }
  }

  async getPendingUsers(): Promise<User[]> {
    try {
      const response = await userService.getPendingUsers();
      return response.data || response.users || response || [];
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
      return this.users.filter(u => u.status === 'pending');
    }
  }

  async updateUserHRData(userId: string, hrData: Partial<User['hrData']>): Promise<void> {
    try {
      const currentUser = this.users.find(u => u.id === userId);
      if (!currentUser) throw new Error('User not found');
      
      const updatedHRData = { ...currentUser.hrData, ...hrData };
      await userService.updateHRData(parseInt(userId), updatedHRData);
      
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index].hrData = updatedHRData;
      }
    } catch (error) {
      console.error('Failed to update user HR data:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Pour l'instant, on désactive l'utilisateur au lieu de le supprimer
      await this.updateUserStatus(userId, false);
      // Optionnellement, on peut le retirer du cache local
      // this.users = this.users.filter(u => u.id !== userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  // Local methods for backward compatibility
  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }

  getActiveUsers(): User[] {
    return this.users.filter(u => u.isActive);
  }
}

export const userServiceInstance = UserService.getInstance();