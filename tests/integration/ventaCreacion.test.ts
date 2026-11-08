import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Cliente } from '../../src/entities/Cliente.entities.js';
import { Usuario } from '../../src/entities/Usuario.entities.js';
import { Venta } from '../../src/entities/Venta.entities.js';

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

describe('Test Integrador 1 - Creación de Venta (Interacción Usuario, Cliente y Venta)', () => {
  let createVenta: (data: any, userId: number) => Promise<void>;
  let mockUsuario: Usuario;
  let mockCliente: Cliente;

  beforeEach(async () => {
    jest.clearAllMocks();

    const ventaService = await import('../../src/services/ventaService.js');
    createVenta = ventaService.createVenta;

    mockUsuario = new Usuario();
    mockUsuario.id = 1;
    mockUsuario.nombre = 'Gonzalo';
    mockUsuario.email = 'gonzalo@velzia.com';

    mockCliente = new Cliente();
    mockCliente.id = 10;
    mockCliente.nombre = 'Alejandro';
    mockCliente.apellido = 'Decaroli';
    mockCliente.usuario = mockUsuario;
  });

  it('debe coordinar la interacción entre Usuario, Cliente y Venta para crear una nueva venta con código secuencial y estado Pendiente', async () => {
    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Cliente && filter.id === 10 && filter.usuario === 1) {
        return Promise.resolve(mockCliente);
      }
      if (entity === Usuario && filter.id === 1) {
        return Promise.resolve(mockUsuario);
      }
      return Promise.resolve(null);
    });

    mockEm.find.mockResolvedValueOnce([]);

    await createVenta({ cliente: 10 }, 1);

    expect(mockEm.findOne).toHaveBeenCalledWith(Cliente, { id: 10, usuario: 1 });
    expect(mockEm.findOne).toHaveBeenCalledWith(Usuario, { id: 1 });
    expect(mockEm.create).toHaveBeenCalledWith(
      Venta,
      expect.objectContaining({
        cod: 'VEN_1',
        cliente: mockCliente,
        usuario: mockUsuario,
        estado: 'Pendiente',
        total: 0,
      })
    );

    expect(mockEm.persistAndFlush).toHaveBeenCalledTimes(1);
    const ventaGuardada = mockEm.persistAndFlush.mock.calls[0][0] as Venta;
    expect(ventaGuardada).toBeInstanceOf(Venta);
    expect(ventaGuardada.cliente).toBe(mockCliente);
    expect(ventaGuardada.usuario).toBe(mockUsuario);
    expect(ventaGuardada.cod).toBe('VEN_1');
    expect(ventaGuardada.total).toBe(0);
    expect(ventaGuardada.estado).toBe('Pendiente');
  });

  it('debe incrementar correlativamente el código de la Venta (VEN_2) si ya existen ventas previas del Usuario', async () => {
    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Cliente && filter.id === 10 && filter.usuario === 1) {
        return Promise.resolve(mockCliente);
      }
      if (entity === Usuario && filter.id === 1) {
        return Promise.resolve(mockUsuario);
      }
      return Promise.resolve(null);
    });

    const ventaPrevia = new Venta();
    ventaPrevia.cod = 'VEN_1';
    mockEm.find.mockResolvedValueOnce([ventaPrevia]);

    await createVenta({ cliente: 10 }, 1);

    expect(mockEm.create).toHaveBeenCalledWith(
      Venta,
      expect.objectContaining({
        cod: 'VEN_2',
        cliente: mockCliente,
        usuario: mockUsuario,
      })
    );
  });

  it('debe rechazar con NotFound y no crear la Venta si el Cliente no existe o no pertenece al Usuario', async () => {
    mockEm.findOne.mockImplementation((entity: any, filter: any) => {
      if (entity === Usuario && filter.id === 1) {
        return Promise.resolve(mockUsuario);
      }
      return Promise.resolve(null);
    });

    await expect(createVenta({ cliente: 999 }, 1)).rejects.toThrow('Cliente no encontrado');
    expect(mockEm.create).not.toHaveBeenCalled();
    expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
  });
});
