import { Request, Response } from 'express';
import Task, { TaskStatus, TaskPriority } from '../models/Task';
import mongoose from 'mongoose';

export class TaskController {
  // Listar tarefas do usuário com filtros
  static async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { status, priority, search, page = 1, limit = 10 } = req.query as any;

      // Construir filtro
      const filter: any = { userId };

      if (status) {
        filter.status = status;
      }

      if (priority) {
        filter.priority = priority;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Configurar paginação
      const skip = (page - 1) * limit;

      // Buscar tarefas
      const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Contar total para paginação
      const total = await Task.countDocuments(filter);

      res.json({
        success: true,
        data: {
          tasks,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Criar nova tarefa
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { title, description, priority } = req.body;

      const task = new Task({
        title,
        description,
        priority: priority || TaskPriority.MEDIA,
        userId
      });

      await task.save();

      res.status(201).json({
        success: true,
        data: { task },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Obter tarefa por ID
  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de tarefa inválido',
          data: null
        });
        return;
      }

      const task = await Task.findOne({ _id: id, userId });

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Tarefa não encontrada',
          data: null
        });
        return;
      }

      res.json({
        success: true,
        data: { task },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Atualizar tarefa
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updateData = req.body;

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de tarefa inválido',
          data: null
        });
        return;
      }

      const task = await Task.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Tarefa não encontrada',
          data: null
        });
        return;
      }

      res.json({
        success: true,
        data: { task },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Deletar tarefa
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de tarefa inválido',
          data: null
        });
        return;
      }

      const task = await Task.findOneAndDelete({ _id: id, userId });

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Tarefa não encontrada',
          data: null
        });
        return;
      }

      res.json({
        success: true,
        data: { message: 'Tarefa deletada com sucesso' },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Deletar todas as tarefas concluídas
  static async deleteCompletedTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const result = await Task.deleteMany({
        userId,
        status: TaskStatus.CONCLUIDO
      });

      res.json({
        success: true,
        data: {
          message: `${result.deletedCount} tarefa(s) concluída(s) deletada(s) com sucesso`
        },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao deletar tarefas concluídas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }
} 