import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import getEnvConfig from './config/env';

// Importar rotas
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';

const env = getEnvConfig();

const createApp = (): Application => {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  
  // CORS
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Logging
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Parsing do body
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Rota de saúde
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'API funcionando!',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV
    });
  });

  // Rotas da API
  app.use('/api/v1/tasks', taskRoutes);
  app.use('/api/v1/auth', authRoutes);

  // Middleware para rotas não encontradas
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Rota não encontrada',
      data: null
    });
  });

  // Middleware de tratamento de erros
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Erro na aplicação:', error);
    
    res.status(error.status || 500).json({
      success: false,
      error: env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor',
      data: null
    });
  });

  return app;
};

export default createApp; 