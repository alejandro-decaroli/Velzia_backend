import { param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const idParamValidation = [
    param('id').isInt().withMessage('ID debe ser un número entero')
];
