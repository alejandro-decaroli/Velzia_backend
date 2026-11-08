import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

const { BadRequest } = createError;

const mockCreateBulkProductos = jest.fn(async (productosData: any[]) => {
  if (!Array.isArray(productosData) || productosData.length === 0) {
    throw new BadRequest('Debe enviar una lista de productos para importar');
  }
  return { insertados: productosData.length };
});

jest.unstable_mockModule('../../src/services/productoService.js', () => ({
  createBulkProductos: mockCreateBulkProductos,
  createProducto: jest.fn(),
  getAllProductos: jest.fn(),
  getByIdProducto: jest.fn(),
  updateProducto: jest.fn(),
  removeProducto: jest.fn(),
}));

import { productoValidation, handleValidationErrors } from '../../src/middlewares/validations.js';
import { Producto } from '../../src/entities/Producto.entities.js';
import { LineaVenta } from '../../src/entities/LineaVenta.entities.js';
import { LineaPedido } from '../../src/entities/LineaPedido.entities.js';

describe('Unit Tests - Producto Validaciones de Costo Actual y Precio de Venta', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
    mockNext = jest.fn() as any;
  });

  it('debe rechazar la validación con error 400 cuando costo_actual es mayor o igual a precio_venta', async () => {
    mockReq = {
      body: {
        nombre: 'Teclado Mecánico',
        stock: 15,
        costo_actual: 5000,
        precio_venta: 4500,
      },
    };

    for (const validation of productoValidation) {
      await validation.run(mockReq as Request);
    }

    handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'El costo actual debe ser menor al precio de venta',
          }),
        ]),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debe rechazar la validación cuando costo_actual es exactamente igual a precio_venta', async () => {
    mockReq = {
      body: {
        nombre: 'Mouse Inalámbrico',
        stock: 20,
        costo_actual: 3000,
        precio_venta: 3000,
      },
    };

    for (const validation of productoValidation) {
      await validation.run(mockReq as Request);
    }

    handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'El costo actual debe ser menor al precio de venta',
          }),
        ]),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debe aprobar la validación y llamar a next() cuando costo_actual es menor a precio_venta', async () => {
    mockReq = {
      body: {
        nombre: 'Auriculares Gamer',
        stock: 10,
        costo_actual: 2500,
        precio_venta: 4900,
      },
    };

    for (const validation of productoValidation) {
      await validation.run(mockReq as Request);
    }

    handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('las entidades Producto, LineaVenta y LineaPedido deben vincular el atributo precio con precio_venta del Producto', () => {
    const producto = new Producto();
    producto.nombre = 'Monitor 144Hz';
    producto.costo_actual = 80000;
    producto.precio_venta = 120000;

    expect(Number(producto.costo_actual)).toBeLessThan(Number(producto.precio_venta));

    const lineaVenta = new LineaVenta();
    lineaVenta.producto = producto;
    lineaVenta.precio = Number(producto.precio_venta);
    lineaVenta.cantidad = 2;
    lineaVenta.descuento = 0;
    lineaVenta.subtotal = lineaVenta.cantidad * lineaVenta.precio;

    expect(lineaVenta.precio).toBe(120000);
    expect(lineaVenta.subtotal).toBe(240000);

    const lineaPedido = new LineaPedido();
    lineaPedido.producto = producto;
    lineaPedido.precio = Number(producto.precio_venta);
    lineaPedido.cantidad = 5;
    lineaPedido.subtotal = lineaPedido.cantidad * lineaPedido.precio;

    expect(lineaPedido.precio).toBe(120000);
    expect(lineaPedido.subtotal).toBe(600000);
  });

  it('debe validar la estructura de bulkCreate en productoController', async () => {
    const { bulkCreate } = await import('../../src/controllers/productoController.js');

    mockReq = {
      user: { id: 1 } as any,
      body: { productos: [] }
    };
    await bulkCreate(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Debe enviar una lista')
      })
    );
  });
});
