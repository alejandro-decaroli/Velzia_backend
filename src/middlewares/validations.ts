import { param, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from 'http-errors';

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
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
];

export const PagoValidation = [
    body('caja')
      .notEmpty().withMessage('Caja ID es requerido')
      .isInt({ min: 1 }).withMessage('Caja ID debe ser un número entero'),
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0.0001 }).withMessage('Monto debe ser un número positivo'),
    body('venta')
      .optional()
      .isInt({ min: 1 }).withMessage('Venta ID debe ser un número entero'),
    body('costo')
      .optional()
      .isInt({ min: 1 }).withMessage('Costo ID debe ser un número entero'),
    body('pedido')
      .optional()
      .isInt({ min: 1 }).withMessage('Pedido ID debe ser un número entero'),
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

export const costoValidation = [
    body('monto')
      .notEmpty().withMessage('Monto es requerido')
      .isFloat({ min: 0 }).withMessage('Monto debe ser un número positivo'),
    body('descripcion')
      .notEmpty().withMessage('Descripción es requerida')
      .isString().withMessage('Descripción debe ser un string'),
    body('categoria')
      .notEmpty().withMessage('Categoría es requerida')
      .isString().withMessage('Categoría debe ser un string'),
    body('estado')
      .optional()
      .isIn(['Pendiente', 'Pagada']).withMessage('Estado debe ser Pendiente o Pagada'),
];

export const costoFijoValidation = costoValidation;

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

export const productoValidation = [
  body('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ min: 2 }).withMessage('Nombre muy corto'),
  body('stock')
    .notEmpty().withMessage('Stock es requerido')
    .isInt({ min: 0 }).withMessage('Stock debe ser un número positivo'),
];

export const detalleValidation = [
  body('precio_unitario')
    .notEmpty().withMessage('Precio unitario es requerido')
    .isFloat({ min: 0 }).withMessage('Precio unitario debe ser un número positivo'),
  body('cantidad')
    .notEmpty().withMessage('Cantidad es requerida')
    .isInt({ min: 0 }).withMessage('Cantidad debe ser un número positivo'),
  body('descuento')
    .notEmpty().withMessage('Descuento es requerido')
    .isFloat({ min: 0 }).withMessage('Descuento debe ser un número positivo'),
];

export const proveedorValidation = [
  body('razon_social')
    .notEmpty().withMessage('Razón social es requerida')
    .isLength({ min: 2 }).withMessage('Razón social muy corta'),
  body('cuit')
    .notEmpty().withMessage('CUIT es requerido')
    .isLength({ min: 8 }).withMessage('CUIT inválido'),
  body('telefono')
    .notEmpty().withMessage('Teléfono es requerido')
    .isLength({ min: 3 }).withMessage('Teléfono muy corto'),
  body('email')
    .optional({ nullable: true })
    .isEmail().withMessage('Email debe ser un email válido'),
  body('direccion')
    .optional({ nullable: true })
    .isLength({ min: 3 }).withMessage('Dirección muy corta'),
];

export const pedidoValidation = [
  body('proveedor')
    .notEmpty().withMessage('Proveedor ID es requerido')
    .isInt({ min: 1 }).withMessage('Proveedor ID debe ser un número entero'),
  body('fecha_emision')
    .optional({ nullable: true })
    .isISO8601().withMessage('Fecha de emisión debe tener formato ISO válido'),
  body('fecha_recepcion')
    .optional({ nullable: true })
    .isISO8601().withMessage('Fecha de recepción debe tener formato ISO válido'),
  body('total')
    .optional()
    .isFloat({ min: 0 }).withMessage('Total debe ser un número positivo'),
  body('estado')
    .optional()
    .isString().withMessage('Estado debe ser un texto'),
];

export const lineaPedidoValidation = [
  body('cantidad')
    .notEmpty().withMessage('Cantidad es requerida')
    .isFloat({ min: 0.0001 }).withMessage('Cantidad debe ser mayor a 0'),
  body('precio')
    .notEmpty().withMessage('Precio es requerido')
    .isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('subtotal')
    .optional()
    .isFloat({ min: 0 }).withMessage('Subtotal debe ser un número positivo'),
  body('producto')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Producto ID debe ser un número entero'),
];

    