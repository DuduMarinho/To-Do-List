import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      res.status(400).json({
        success: false,
        error: errorMessage,
        data: null
      });
      return;
    }

    // Substituir req.body pelos dados validados e limpos
    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      res.status(400).json({
        success: false,
        error: errorMessage,
        data: null
      });
      return;
    }

    // Substituir req.query pelos dados validados
    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      res.status(400).json({
        success: false,
        error: errorMessage,
        data: null
      });
      return;
    }

    req.params = value;
    next();
  };
}; 