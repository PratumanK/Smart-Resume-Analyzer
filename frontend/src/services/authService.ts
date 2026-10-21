import { api } from '../lib/api';
import type { AuthResponse, User } from '../types';

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  userName?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', payload);
  },

  logout(): void {
    localStorage.removeItem('sra_token');
    localStorage.removeItem('sra_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('sra_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('sra_token');
  },

  saveAuthSession(token: string, user: User): void {
    localStorage.setItem('sra_token', token);
    localStorage.setItem('sra_user', JSON.stringify(user));
  },
};
