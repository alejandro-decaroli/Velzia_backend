import { body } from 'express-validator';

export const createClienteValidation = [
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

