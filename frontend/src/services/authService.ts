import { api, handleApiResponse, handleApiError } from './api';
import { LoginData, RegisterData, AuthResponse, User } from '@/types/User';
import { ApiResponse } from '@/types/Api';

export class AuthService {
  // Login
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      const authData = handleApiResponse(response);
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      return authData;
    } catch (error: any) {
      handleApiError(error);
    }
  }

  // Registro
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      const authData = handleApiResponse(response);
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      return authData;
    } catch (error: any) {
      handleApiError(error);
    }
  }

  // Obter dados do usuário atual
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      const data = handleApiResponse(response);
      return data.user;
    } catch (error: any) {
      handleApiError(error);
    }
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar se usuário está logado
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Obter usuário do localStorage
  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Obter token do localStorage
  static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }
} 