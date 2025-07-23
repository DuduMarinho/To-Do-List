import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import Button from '@/components/UI/Button';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, isLoading, loadTasks } = useTasks();

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
              <p className="text-gray-600">Bem-vindo(a), {user?.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => {}}>
                Adicionar Tarefa
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner h-8 w-8" />
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Você ainda não tem tarefas.
                </p>
                <p className="text-gray-400 mt-2">
                  Crie sua primeira tarefa clicando no botão "Adicionar Tarefa"
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="card-content">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                            {task.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="danger">
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage; 