import jwt from 'jsonwebtoken';
import getEnvConfig from '../config/env';

const env = getEnvConfig();

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('Token de autorização não fornecido');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Formato de token inválido');
  }

  return authHeader.substring(7);
}; 