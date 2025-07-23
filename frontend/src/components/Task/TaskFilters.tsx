import React from 'react';
import { TaskStatus, TaskPriority, priorityLabels, statusLabels } from '@/types/Task';
import { Search, Filter } from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  priority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onClearFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onClearFilters,
}) => {
  const hasActiveFilters = search || status !== 'all' || priority !== 'all';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-sm text-primary-600 hover:text-primary-700"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca por texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título ou descrição..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Filtro por status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
            className="select"
          >
            <option value="all">Todos os status</option>
            {Object.values(TaskStatus).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusLabels[statusValue]}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="select"
          >
            <option value="all">Todas as prioridades</option>
            {Object.values(TaskPriority).map((priorityValue) => (
              <option key={priorityValue} value={priorityValue}>
                {priorityLabels[priorityValue]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters; 