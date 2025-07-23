import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { validateBody, validateQuery, validateParams } from '../middlewares/validation';
import { authenticateJWT } from '../middlewares/auth';
import { 
  taskCreateSchema, 
  taskUpdateSchema, 
  taskFiltersSchema 
} from '../utils/validation';
import Joi from 'joi';

const router = Router();

// Middleware de autenticação para todas as rotas de tarefas
router.use(authenticateJWT);

// Schema para validar ID nos parâmetros
const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'ID é obrigatório'
  })
});

// GET /api/v1/tasks - Listar tarefas com filtros
router.get('/',
  validateQuery(taskFiltersSchema),
  TaskController.getTasks
);

// POST /api/v1/tasks - Criar nova tarefa
router.post('/',
  validateBody(taskCreateSchema),
  TaskController.createTask
);

// GET /api/v1/tasks/:id - Obter tarefa por ID
router.get('/:id',
  validateParams(idParamSchema),
  TaskController.getTaskById
);

// PUT /api/v1/tasks/:id - Atualizar tarefa
router.put('/:id',
  validateParams(idParamSchema),
  validateBody(taskUpdateSchema),
  TaskController.updateTask
);

// DELETE /api/v1/tasks/:id - Deletar tarefa
router.delete('/:id',
  validateParams(idParamSchema),
  TaskController.deleteTask
);

// DELETE /api/v1/tasks/completed/all - Deletar todas as tarefas concluídas
router.delete('/completed/all',
  TaskController.deleteCompletedTasks
);

export default router; 