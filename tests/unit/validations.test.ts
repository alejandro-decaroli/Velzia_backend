import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { ventaValidation, handleValidationErrors } from '../../src/middlewares/validations.js';

describe('Unit Tests - Validaciones (ventaValidation y handleValidationErrors)', () => {
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

  // Test Unitario 1: Fallo de validación cuando los campos requeridos no se envían o son inválidos
  it('debe responder con estado 400 y mensaje de error cuando "cliente" está ausente o no es un entero', async () => {
    mockReq = {
      body: {}, // Cliente no presente
    };

    // Ejecutar cada regla de validación de express-validator sobre la request
    for (const validation of ventaValidation) {
      await validation.run(mockReq as Request);
    }

    // Ejecutar el middleware que evalúa los resultados de la validación
    handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Cliente ID es requerido',
          }),
        ]),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Test Unitario 1 (caso exitoso): Validación correcta cuando los datos cumplen las reglas
  it('debe llamar a next() y no devolver error cuando los datos de validación son válidos', async () => {
    mockReq = {
      body: {
        cliente: 1, // ID entero válido
      },
    };

    for (const validation of ventaValidation) {
      await validation.run(mockReq as Request);
    }

    handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
