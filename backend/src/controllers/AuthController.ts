import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

export class AuthController {
  // Registro de usuário
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Verificar se usuário já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Usuário já existe com este email',
          data: null
        });
        return;
      }

      // Criar novo usuário
      const user = new User({ name, email, password });
      await user.save();

      // Gerar token
      const token = generateToken({
        userId: user.id,
        email: user.email
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        },
        error: null
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Login de usuário
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Buscar usuário (incluindo senha)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas',
          data: null
        });
        return;
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas',
          data: null
        });
        return;
      }

      // Gerar token
      const token = generateToken({
        userId: user.id,
        email: user.email
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        },
        error: null
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }

  // Verificar token (rota protegida para obter dados do usuário atual)
  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
          data: null
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          }
        },
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: null
      });
    }
  }
} 