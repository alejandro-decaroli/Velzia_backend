import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import createError from 'http-errors';

const { NotFound, BadRequest } = createError;

const mockGetByIdVenta = jest.fn();
const mockCreateVenta = jest.fn();

// Mockeamos la capa de servicio para aislar completamente el controlador (Unit Test puro)
jest.unstable_mockModule('../../src/services/ventaService.js', () => ({
  getByIdVenta: mockGetByIdVenta,
  createVenta: mockCreateVenta,
  getAllVentas: jest.fn(),
  removeVenta: jest.fn(),
  updateVenta: jest.fn(),
  cancelarVenta: jest.fn(),
  pagarVenta: jest.fn(),
}));

// Mockeamos lineaVentaService que también importa ventaController
jest.unstable_mockModule('../../src/services/lineaVentaService.js', () => ({
  registrarDetalle: jest.fn(),
  detallesByUser: jest.fn(),
  delete_Detalle_Venta: jest.fn(),
  update_Detalle_Venta: jest.fn(),
  DetalleVentaById: jest.fn(),
  DetalleVenta: jest.fn(),
}));

describe('Unit Tests - Manejo y Devolución Correcta de Errores (ventaController)', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let ventaController: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    // Import dinámico después de mockear las dependencias
    const module = await import('../../src/controllers/ventaController.js');
    ventaController = module.default || module;
  });

  it('debe devolver error 404 (Not Found) cuando la venta buscada no existe', async () => {
    mockReq = {
      user: { id: 1 } as any,
      params: { id: '999' },
    };

    // Simulamos que el servicio lanza NotFound (status 404)
    mockGetByIdVenta.mockRejectedValueOnce(new NotFound('Venta no encontrada'));

    await ventaController.getById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Venta no encontrada',
    });
  });

  it('debe devolver error 400 (Bad Request) cuando el ID recibido es inválido', async () => {
    mockReq = {
      user: { id: 1 } as any,
      params: { id: 'abc' },
    };

    // Simulamos que el servicio rechaza con BadRequest (status 400)
    mockGetByIdVenta.mockRejectedValueOnce(new BadRequest('ID inválido'));

    await ventaController.getById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'ID inválido',
    });
  });

  it('debe devolver error 500 (Internal Server Error) ante una falla inesperada sin status definido', async () => {
    mockReq = {
      user: { id: 1 } as any,
      params: { id: '1' },
    };

    // Error no controlado (ej. fallo de conexión a BD)
    mockGetByIdVenta.mockRejectedValueOnce(new Error('Fallo crítico de conexión'));

    await ventaController.getById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Fallo crítico de conexión',
    });
  });
});
