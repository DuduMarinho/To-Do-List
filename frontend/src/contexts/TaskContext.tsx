import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskListResponse } from '@/types/Task';
import { TaskService } from '@/services/taskService';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: TaskFilters;
}

interface TaskContextValue extends TaskState {
  loadTasks: (filters?: TaskFilters) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: TaskListResponse }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: TaskFilters };

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        isLoading: false,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadTasks = async (filters: TaskFilters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const finalFilters = { ...state.filters, ...filters };
      const data = await TaskService.getTasks(finalFilters);
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar tarefas');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTask = async (data: CreateTaskData) => {
    try {
      const newTask = await TaskService.createTask(data);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      toast.success('Tarefa criada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar tarefa');
      throw error;
    }
  };

  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await TaskService.updateTask(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar tarefa');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Tarefa deletada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar tarefa');
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'pendente' ? 'concluido' : 'pendente';
    await updateTask(id, { status: newStatus as any });
  };

  const deleteCompletedTasks = async () => {
    try {
      await TaskService.deleteCompletedTasks();
      await loadTasks(state.filters);
      toast.success('Tarefas concluídas deletadas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar tarefas concluídas');
      throw error;
    }
  };

  const setFilters = (filters: TaskFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const value: TaskContextValue = {
    ...state,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    deleteCompletedTasks,
    setFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks deve ser usado dentro de um TaskProvider');
  }
  return context;
}; 