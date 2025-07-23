import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '../utils/jwt';
import User from '../models/User';

// Extender interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extrair token do header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    // Verificar token
    const decoded: TokenPayload = verifyToken(token);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não encontrado',
        data: null
      });
      return;
    }
    
    // Adicionar usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Token inválido',
      data: null
    });
  }
}; 