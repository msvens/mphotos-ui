import { User } from '../types';
import { API_ENDPOINTS } from '../config';
import { api } from '../client';

export interface UsersService {
  getUsers(): Promise<User[]>;
  getUser(name: string): Promise<User>;
  getCurrentUser(): Promise<User>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(name: string, user: Partial<User>): Promise<User>;
  deleteUser(name: string): Promise<void>;
  uploadUserImage(name: string, file: File): Promise<User>;
  getUserImageUrl(name: string): string;
}

export const usersService: UsersService = {
  async getUsers() {
    return api.get<User[]>(API_ENDPOINTS.users);
  },

  async getUser(name: string) {
    return api.get<User>(API_ENDPOINTS.user(name));
  },

  async getCurrentUser() {
    return api.get<User>(API_ENDPOINTS.currentUser);
  },

  async createUser(user: Partial<User>) {
    return api.post<User>(API_ENDPOINTS.users, user);
  },

  async updateUser(name: string, user: Partial<User>) {
    return api.put<User>(API_ENDPOINTS.user(name), user);
  },

  async deleteUser(name: string) {
    return api.delete(API_ENDPOINTS.user(name));
  },

  async uploadUserImage(name: string, file: File) {
    const formData = new FormData();
    formData.append('userImage', file, file.name);
    return api.post<User>(API_ENDPOINTS.userImage(name), formData);
  },

  getUserImageUrl(name: string) {
    return API_ENDPOINTS.userImage(name);
  },
}; 