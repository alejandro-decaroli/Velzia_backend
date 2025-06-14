import { param, body, validationResult } from 'express-validator';
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

export const CajaValidation = [
    body('nombre')
      .notEmpty().withMessage('Nombre es requerido')
      .isLength({ min: 3 }).withMessage('Nombre muy corto'),
    body('tipo')
      .notEmpty().withMessage('Tipo es requerido')
      .isIn(['Activo', 'Inactivo']).withMessage('Tipo debe ser Activo o Inactivo')
];

export const PagoValidation = [
  body('cliente_id')
    .notEmpty().withMessage('Id es requerido')
    .isInt({ min: 0 }).withMessage('Cliente ID debe ser un número entero'),
  body('caja_id')
    .notEmpty().withMessage('Id es requerido')
    .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
  body('monto')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo')
];

export const ClienteValidation = [
  body('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ min: 3 }).withMessage('Nombre muy corto'),
  body('siglas')
    .notEmpty().withMessage('Siglas son requeridas')
    .isLength({ min: 2 }).withMessage('Siglas muy cortas')
    .isLength({ max: 4 }).withMessage('Siglas muy largas'),
  body('estado')
    .notEmpty().withMessage('Estado es requerido')
    .isIn(['Activo', 'Terminado']).withMessage('Estado debe ser Activo o Terminado')
];

export const ajusteValidation = [
  body('caja_id')
    .notEmpty().withMessage('Caja ID es requerido')
    .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
  body('monto')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
  body('movimiento')
    .notEmpty().withMessage('Movimiento es requerido')
    .isIn(['Positivo', 'Negativo']).withMessage('Movimiento debe ser Positivo o Negativo')
];

export const aporteDividendoSocioValidation = [
    body('caja_id')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
];

export const costoFijoValidation = [
    body('caja_id')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
    body('adjudicacion')
      .notEmpty().withMessage('Adjudicación es requerida')
      .isString().withMessage('Adjudicación debe ser un string')
];

export const monedaValidation = [
  body('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ min: 3 }).withMessage('Nombre muy corto'),
  body('codigo_iso')
    .notEmpty().withMessage('Código ISO es requerido')
    .isLength({ min: 2 }).withMessage('Código ISO muy corto')
    .isLength({ max: 3 }).withMessage('Código ISO muy largo'),
];