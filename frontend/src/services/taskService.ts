import { api, handleApiResponse, handleApiError } from './api';
import { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TaskListResponse 
} from '@/types/Task';
import { ApiResponse } from '@/types/Api';

export class TaskService {
  // Listar tarefas com filtros
  static async getTasks(filters: TaskFilters = {}): Promise<TaskListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<ApiResponse<TaskListResponse>>(
        `/tasks?${params.toString()}`
      );
      
      return handleApiResponse(response);
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Criar nova tarefa
  static async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<{ task: Task }>>('/tasks', data);
      const result = handleApiResponse(response);
      return result.task;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Obter tarefa por ID
  static async getTaskById(id: string): Promise<Task> {
    try {
      const response = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
      const result = handleApiResponse(response);
      return result.task;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Atualizar tarefa
  static async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      const response = await api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
      const result = handleApiResponse(response);
      return result.task;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Deletar tarefa
  static async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Marcar tarefa como concluída
  static async markAsCompleted(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'concluido' as any });
  }

  // Marcar tarefa como pendente
  static async markAsPending(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'pendente' as any });
  }

  // Deletar todas as tarefas concluídas
  static async deleteCompletedTasks(): Promise<void> {
    try {
      await api.delete('/tasks/completed/all');
    } catch (error: any) {
      return handleApiError(error);
    }
  }
} 