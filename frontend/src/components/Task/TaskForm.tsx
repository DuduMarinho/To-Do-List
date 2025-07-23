import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task, CreateTaskData, TaskPriority } from '@/types/Task';
import { useTasks } from '@/contexts/TaskContext';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // Se fornecido, será edição; senão, criação
}

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task }) => {
  const { createTask, updateTask } = useTasks();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIA,
    },
  });

  // Resetar formulário quando modal abrir/fechar ou task mudar
  useEffect(() => {
    if (isOpen && task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
      });
    } else if (isOpen && !task) {
      reset({
        title: '',
        description: '',
        priority: TaskPriority.MEDIA,
      });
    }
  }, [isOpen, task, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const taskData: CreateTaskData = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        priority: data.priority,
      };

      if (isEditing && task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }

      onClose();
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            {...register('title', {
              required: 'Título é obrigatório',
              maxLength: {
                value: 50,
                message: 'Título deve ter no máximo 50 caracteres',
              },
            })}
            type="text"
            className="input"
            placeholder="Digite o título da tarefa"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            {...register('description', {
              maxLength: {
                value: 200,
                message: 'Descrição deve ter no máximo 200 caracteres',
              },
            })}
            className="textarea"
            placeholder="Digite uma descrição opcional"
            rows={3}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <div className="flex gap-4">
            {Object.values(TaskPriority).map((priority) => (
              <label key={priority} className="flex items-center cursor-pointer">
                <input
                  {...register('priority')}
                  type="radio"
                  value={priority}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700 capitalize">
                  {priority === TaskPriority.MEDIA ? 'Média' : priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm; 