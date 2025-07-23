import Joi from 'joi';
import { TaskPriority, TaskStatus } from '../models/Task';

// Schema de validação para registro de usuário
export const userRegisterSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 50 caracteres'
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'string.empty': 'Email é obrigatório'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.empty': 'Senha é obrigatória'
    })
});

// Schema de validação para login
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'string.empty': 'Email é obrigatório'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Senha é obrigatória'
    })
});

// Schema de validação para criação de tarefa
export const taskCreateSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Título é obrigatório',
      'string.max': 'Título deve ter no máximo 50 caracteres'
    }),
  description: Joi.string()
    .trim()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Descrição deve ter no máximo 200 caracteres'
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .default(TaskPriority.MEDIA)
    .messages({
      'any.only': 'Prioridade deve ser: baixa, média ou alta'
    })
});

// Schema de validação para atualização de tarefa
export const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.empty': 'Título não pode estar vazio',
      'string.max': 'Título deve ter no máximo 50 caracteres'
    }),
  description: Joi.string()
    .trim()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Descrição deve ter no máximo 200 caracteres'
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional()
    .messages({
      'any.only': 'Prioridade deve ser: baixa, média ou alta'
    }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional()
    .messages({
      'any.only': 'Status deve ser: pendente ou concluído'
    })
}).min(1);

// Schema de validação para query params de filtros
export const taskFiltersSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional(),
  search: Joi.string()
    .trim()
    .max(100)
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
}); 