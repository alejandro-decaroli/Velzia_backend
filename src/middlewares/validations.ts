import { param, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from 'http-errors';

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
    body('moneda')
      .notEmpty().withMessage('Moneda ID es requerido')
      .isInt({ min: 0 }).withMessage('Moneda ID debe ser un número entero'),
    body('siglas')
      .notEmpty().withMessage('Siglas son requeridas')
      .isLength({ min: 2 }).withMessage('Siglas muy cortas')
      .isLength({ max: 4 }).withMessage('Siglas muy largas'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
];

export const PagoValidation = [
    body('venta')
      .notEmpty().withMessage('Venta ID es requerido')
      .isInt({ min: 0 }).withMessage('Venta ID debe ser un número entero'),
    body('caja')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo')
];

export const ClienteValidation = [
  body('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ min: 3 }).withMessage('Nombre muy corto'),
  body('apellido')
    .notEmpty().withMessage('Apellido es requerido')
    .isLength({ min: 3 }).withMessage('Apellido muy corto'),
  body('telefono')
    .notEmpty().withMessage('Telefono es requerido')
    .isLength({ min: 3 }).withMessage('Telefono muy corto'),
  body('email')
    .isLength({ min: 3 }).withMessage('Email muy corto'),
  body('direccion')
    .isLength({ min: 3 }).withMessage('Direccion muy corta'),
];

export const ajusteValidation = [
  body('caja')
    .notEmpty().withMessage('Caja ID es requerido')
    .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
  body('monto')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
  body('movimiento')
    .notEmpty().withMessage('Movimiento es requerido')
    .isIn(['ingreso', 'egreso']).withMessage('Movimiento debe ser ingreso o egreso')
];

export const aporteDividendoSocioValidation = [
    body('caja')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
];

export const costoFijoValidation = [
    body('caja')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
    body('adjudicacion')
      .notEmpty().withMessage('Adjudicación es requerida')
      .isString().withMessage('Adjudicación debe ser un string')
];

export const costoVariableValidation = [
  body('caja')
    .notEmpty().withMessage('Caja ID es requerido')
    .isInt({ min: 0 }).withMessage('Caja ID debe ser un número entero'),
  body('monto_real')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
  body('adjudicacion')
    .notEmpty().withMessage('Adjudicación es requerida')
    .isString().withMessage('Adjudicación debe ser un string'),
  body('venta')
    .notEmpty().withMessage('Venta es requerida')
    .isInt({ min: 0 }).withMessage('Venta ID debe ser un número entero'),
  body('presupuestado')
    .isFloat({ min: 0 }).withMessage('Presupuestado debe ser un número positivo'),
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

export const tasaValidation = [
  body('moneda_origen')
    .notEmpty().withMessage('Moneda de origen es requerida')
    .isInt({ min: 0 }).withMessage('Moneda de origen ID debe ser un número entero'),
  body('moneda_destino')
    .notEmpty().withMessage('Moneda de destino es requerida')
    .isInt({ min: 0 }).withMessage('Moneda de destino ID debe ser un número entero'),
  body('tasa')
    .notEmpty().withMessage('Tasa es requerida')
    .isFloat({ min: 0 }).withMessage('Tasa debe ser un número positivo'),
];

export const transferenciaValidation = [
  body('caja_origen')
    .notEmpty().withMessage('Caja de origen es requerida')
    .isInt({ min: 0 }).withMessage('Caja de origen ID debe ser un número entero'),
  body('caja_destino')
    .notEmpty().withMessage('Caja de destino es requerida')
    .isInt({ min: 0 }).withMessage('Caja de destino ID debe ser un número entero'),
  body('monto')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
];

export const ventaValidation = [
  body('moneda')
    .notEmpty().withMessage('Moneda ID es requerida')
    .isInt({ min: 0 }).withMessage('Moneda ID debe ser un número entero'),
  body('monto')
    .notEmpty().withMessage('Monto es requerido')
    .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
  body('cliente')
    .notEmpty().withMessage('Cliente ID es requerido')
    .isInt({ min: 0 }).withMessage('Cliente ID debe ser un número entero'),
];
    
export const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email es requerido')
        .isEmail().withMessage('Email debe ser un email valido'),
    body('contrasenia')
        .notEmpty().withMessage('Contraseña es requerida')
        .isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
];
    