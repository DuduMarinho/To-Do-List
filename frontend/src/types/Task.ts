export enum TaskPriority {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

export enum TaskStatus {
  PENDENTE = 'pendente',
  CONCLUIDO = 'concluido'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const priorityColors = {
  [TaskPriority.BAIXA]: 'bg-green-100 text-green-800 border-green-200',
  [TaskPriority.MEDIA]: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  [TaskPriority.ALTA]: 'bg-red-100 text-red-800 border-red-200'
};

export const priorityLabels = {
  [TaskPriority.BAIXA]: 'Baixa',
  [TaskPriority.MEDIA]: 'Média',
  [TaskPriority.ALTA]: 'Alta'
};

export const statusLabels = {
  [TaskStatus.PENDENTE]: 'Pendente',
  [TaskStatus.CONCLUIDO]: 'Concluído'
}; 