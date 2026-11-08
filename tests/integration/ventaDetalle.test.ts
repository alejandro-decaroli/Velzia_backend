import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Venta } from '../../src/entities/Venta.entities.js';
import { Producto } from '../../src/entities/Producto.entities.js';
import { LineaVenta } from '../../src/entities/LineaVenta.entities.js';
import { Usuario } from '../../src/entities/Usuario.entities.js';

const mockEm = {
  findOne: jest.fn<any>(),
  find: jest.fn<any>(),
  create: jest.fn<any>((entityClass: any, data: any) => {
    const instance = new entityClass();
    Object.assign(instance, data);
    return instance;
  }),
  persistAndFlush: jest.fn<any>(),
};

jest.unstable_mockModule('../../src/db/orm.js', () => ({
  orm: {
    em: mockEm,
  },
}));

describe('Test Integrador 2 - Registro de Detalle de Venta (Interacción Venta, Producto y LineaVenta)', () => {
  let registrarDetalle: (data: any, userId: number, ventaId: number) => Promise<void>;
  let mockUsuario: Usuario;
  let mockVenta: Venta;
  let mockProducto: Producto;

  beforeEach(async () => {
    jest.clearAllMocks();

    const lineaVentaService = await import('../../src/services/lineaVentaService.js');
    registrarDetalle = lineaVentaService.registrarDetalle;

    mockUsuario = new Usuario();
    mockUsuario.id = 1;
    mockUsuario.nombre = 'Gonzalo';

    mockVenta = new Venta();
    mockVenta.id = 50;
    mockVenta.total = 0;
    mockVenta.estado = 'Pendiente';
    mockVenta.usuario = mockUsuario;

    mockProducto = new Producto();
    mockProducto.id = 100;
    mockProducto.nombre = 'Monitor 24 pulg';
    mockProducto.stock = 20;
    mockProducto.costo_actual = 1000;
    mockProducto.precio_venta = 1500;
    mockProducto.usuario = mockUsuario;
  });

  it('debe sincronizar el decremento de stock en Producto y el incremento del total en Venta al agregar una LineaVenta', async () => {
    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Usuario && filter.id === 1) return Promise.resolve(mockUsuario);
      if (entity === Producto && filter.id === 100 && filter.usuario === 1) return Promise.resolve(mockProducto);
      if (entity === Venta && filter.id === 50 && filter.usuario === 1) return Promise.resolve(mockVenta);
      return Promise.resolve(null);
    });

    mockEm.find.mockResolvedValueOnce([]);

    const detallePayload = {
      producto: 100,
      cantidad: 5,
      precio: 1500,
      descuento: 10,
    };

    await registrarDetalle(detallePayload, 1, 50);

    expect(mockProducto.stock).toBe(15);

    expect(mockVenta.total).toBe(6750);

    expect(mockEm.create).toHaveBeenCalledWith(
      LineaVenta,
      expect.objectContaining({
        cod: 'DE_1',
        venta: mockVenta,
        producto: mockProducto,
        cantidad: 5,
        precio: 1500,
        descuento: 10,
        subtotal: 6750,
      })
    );

    expect(mockEm.persistAndFlush).toHaveBeenCalledWith(expect.any(LineaVenta));
    expect(mockEm.persistAndFlush).toHaveBeenCalledWith(mockProducto);
    expect(mockEm.persistAndFlush).toHaveBeenCalledWith(mockVenta);
  });

  it('debe rechazar con Conflict y no modificar el stock del Producto ni el total de la Venta si el stock es insuficiente', async () => {
    mockProducto.stock = 3;

    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Usuario) return Promise.resolve(mockUsuario);
      if (entity === Producto) return Promise.resolve(mockProducto);
      if (entity === Venta) return Promise.resolve(mockVenta);
      return Promise.resolve(null);
    });

    const detallePayload = {
      producto: 100,
      cantidad: 10,
      precio: 1500,
      descuento: 0,
    };

    await expect(registrarDetalle(detallePayload, 1, 50)).rejects.toThrow('Stock insuficiente');

    expect(mockProducto.stock).toBe(3);
    expect(mockVenta.total).toBe(0);
    expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
  });

  it('debe rechazar con Conflict si la Venta ya se encuentra en estado Pagado o Cancelada', async () => {
    mockVenta.estado = 'Pagado';

    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Usuario) return Promise.resolve(mockUsuario);
      if (entity === Producto) return Promise.resolve(mockProducto);
      if (entity === Venta) return Promise.resolve(mockVenta);
      return Promise.resolve(null);
    });

    const detallePayload = {
      producto: 100,
      cantidad: 1,
      precio: 1500,
      descuento: 0,
    };

    await expect(registrarDetalle(detallePayload, 1, 50)).rejects.toThrow(
      'No se puede agregar líneas a una venta que ya está pagada o cancelada'
    );
    expect(mockProducto.stock).toBe(20);
    expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
  });
});
