import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types/Api';

// Configuração base da API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Se o token expirou, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirecionar para login será feito pelo contexto de auth
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Funções helper para tratar respostas
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.error || 'Erro desconhecido');
};

export const handleApiError = (error: AxiosError<ApiError>): never => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  
  if (error.message) {
    throw new Error(error.message);
  }
  
  throw new Error('Erro de conexão com o servidor');
}; 