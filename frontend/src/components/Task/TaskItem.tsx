import React, { useState } from 'react';
import { Task, TaskStatus, priorityColors, priorityLabels, statusLabels } from '@/types/Task';
import { useTasks } from '@/contexts/TaskContext';
import Button from '@/components/UI/Button';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      await toggleTaskStatus(task.id);
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        setIsDeleting(true);
        await deleteTask(task.id);
      } catch (error) {
        // Erro já tratado no contexto
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const isCompleted = task.status === TaskStatus.CONCLUIDO;

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Título */}
            <h3 className={`text-lg font-medium ${
              isCompleted 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
            }`}>
              {task.title}
            </h3>

            {/* Descrição */}
            {task.description && (
              <p className={`mt-1 text-sm ${
                isCompleted 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            {/* Tags de prioridade e status */}
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}>
                {statusLabels[task.status]}
              </span>
            </div>

            {/* Data de criação */}
            <p className="text-xs text-gray-400 mt-2">
              Criado em {new Date(task.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-2 ml-4">
            {/* Botão de toggle status */}
            <Button
              size="sm"
              variant={isCompleted ? "outline" : "primary"}
              onClick={handleToggleStatus}
              disabled={isToggling || isDeleting}
              isLoading={isToggling}
              className="min-w-[100px]"
            >
              {isToggling ? (
                'Atualizando...'
              ) : isCompleted ? (
                <>
                  <X size={14} className="mr-1" />
                  Reabrir
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" />
                  Concluir
                </>
              )}
            </Button>

            {/* Botões de editar e deletar */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(task)}
                disabled={isToggling || isDeleting}
                className="p-2"
              >
                <Edit2 size={14} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDelete}
                disabled={isToggling || isDeleting}
                isLoading={isDeleting}
                className="p-2"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 