import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { Task, TaskStatus, TaskPriority } from '@/types/Task';
import Button from '@/components/UI/Button';
import TaskForm from '@/components/Task/TaskForm';
import TaskItem from '@/components/Task/TaskItem';
import TaskFilters from '@/components/Task/TaskFilters';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, isLoading, loadTasks, deleteCompletedTasks } = useTasks();
  
  // Estados do modal
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  
  // Estados dos filtros
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  
  // Estados de loading para ações
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  // Carregar tarefas ao montar componente
  useEffect(() => {
    loadTasks();
  }, []);

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro de busca
      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Filtro de status
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Filtro de prioridade
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchFilter, statusFilter, priorityFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(task => task.status === TaskStatus.PENDENTE).length;
    const completed = tasks.filter(task => task.status === TaskStatus.CONCLUIDO).length;
    return { total, pending, completed };
  }, [tasks]);

  // Handlers
  const handleOpenTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleClearFilters = () => {
    setSearchFilter('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleDeleteCompleted = async () => {
    if (stats.completed === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir todas as ${stats.completed} tarefas concluídas?`)) {
      try {
        setIsDeletingCompleted(true);
        await deleteCompletedTasks();
      } catch (error) {
        // Erro já tratado no contexto
      } finally {
        setIsDeletingCompleted(false);
      }
    }
  };

  const handleRefresh = () => {
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
              <p className="text-gray-600">Bem-vindo(a), {user?.name}!</p>
              
              {/* Estatísticas */}
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-500">
                  Total: <span className="font-medium text-gray-900">{stats.total}</span>
                </span>
                <span className="text-yellow-600">
                  Pendentes: <span className="font-medium">{stats.pending}</span>
                </span>
                <span className="text-green-600">
                  Concluídas: <span className="font-medium">{stats.completed}</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RotateCcw size={16} className="mr-1" />
                Atualizar
              </Button>
              
              {stats.completed > 0 && (
                <Button
                  onClick={handleDeleteCompleted}
                  variant="danger"
                  size="sm"
                  isLoading={isDeletingCompleted}
                  disabled={isDeletingCompleted}
                >
                  <Trash2 size={16} className="mr-1" />
                  Limpar Concluídas ({stats.completed})
                </Button>
              )}
              
              <Button onClick={handleOpenTaskForm}>
                <Plus size={16} className="mr-1" />
                Nova Tarefa
              </Button>
              
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <TaskFilters
          search={searchFilter}
          onSearchChange={setSearchFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Lista de tarefas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="spinner h-8 w-8 mx-auto mb-4" />
              <p className="text-gray-600">Carregando tarefas...</p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            {tasks.length === 0 ? (
              // Nenhuma tarefa criada
              <>
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma tarefa encontrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando sua primeira tarefa para organizar seu dia!
                </p>
                <Button onClick={handleOpenTaskForm}>
                  <Plus size={16} className="mr-1" />
                  Criar Primeira Tarefa
                </Button>
              </>
            ) : (
              // Filtros não retornaram resultados
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma tarefa encontrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros ou criar uma nova tarefa.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpar Filtros
                  </Button>
                  <Button onClick={handleOpenTaskForm}>
                    <Plus size={16} className="mr-1" />
                    Nova Tarefa
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Lista de tarefas
          <div className="space-y-4">
            {/* Contador de resultados */}
            {tasks.length !== filteredTasks.length && (
              <div className="text-sm text-gray-600 mb-4">
                Mostrando {filteredTasks.length} de {tasks.length} tarefas
              </div>
            )}
            
            {/* Tarefas */}
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de criação/edição de tarefa */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        task={editingTask}
      />
    </div>
  );
};

export default HomePage; 