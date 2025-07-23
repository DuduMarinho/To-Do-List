import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validation';
import { authenticateJWT } from '../middlewares/auth';
import { userRegisterSchema, userLoginSchema } from '../utils/validation';

const router = Router();

// POST /api/v1/auth/register - Registro de usuário
router.post('/register', 
  validateBody(userRegisterSchema),
  AuthController.register
);

// POST /api/v1/auth/login - Login de usuário
router.post('/login',
  validateBody(userLoginSchema),
  AuthController.login
);

// GET /api/v1/auth/me - Obter dados do usuário atual (rota protegida)
router.get('/me',
  authenticateJWT,
  AuthController.me
);

export default router; 