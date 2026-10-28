import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Usuario } from '../../src/entities/Usuario.entities.js';
import { Caja } from '../../src/entities/Caja.entities.js';
import { Venta } from '../../src/entities/Venta.entities.js';
import { Pedido } from '../../src/entities/Pedido.entities.js';
import { Costo } from '../../src/entities/Costo.entities.js';
import { MovF } from '../../src/entities/MovF.entities.js';
import { MovimientoSeeder } from '../../src/seeder/MovimientoSeeder.js';

describe('MovimientoSeeder Tests', () => {
  let mockEm: any;
  let usuario: Usuario;
  let caja: Caja;
  let ventasPagas: Venta[];
  let pedidosPagos: Pedido[];
  let costosPagos: Costo[];

  beforeEach(() => {
    usuario = new Usuario();
    usuario.id = 1;

    caja = new Caja();
    caja.id = 1;
    caja.cod = 'CA_1';
    caja.nombre = 'Caja Principal';

    const v1 = new Venta();
    v1.id = 1;
    v1.cod = 'VE_1';
    v1.total = 200;
    v1.estado = 'Paga';

    const v2 = new Venta();
    v2.id = 2;
    v2.cod = 'VE_2';
    v2.total = 100;
    v2.estado = 'Paga';

    ventasPagas = [v1, v2];

    const p1 = new Pedido();
    p1.id = 1;
    p1.cod = 'PE_1';
    p1.total = 1500;
    p1.estado = 'Pagado';

    pedidosPagos = [p1];

    const c1 = new Costo();
    c1.id = 1;
    c1.cod = 'CO_1';
    c1.monto = 200;
    c1.categoria = 'Impuesto';
    c1.descripcion = 'TGI';
    c1.estado = 'Pagada';

    costosPagos = [c1];

    mockEm = {
      findOne: jest.fn((entity: any) => {
        if (entity === Usuario) return Promise.resolve(usuario);
        if (entity === Caja) return Promise.resolve(caja);
        return Promise.resolve(null);
      }),
      find: jest.fn((entity: any, filter: any) => {
        if (entity === MovF) return Promise.resolve([]); // No hay movimientos previos
        if (entity === Venta) return Promise.resolve(ventasPagas);
        if (entity === Pedido) return Promise.resolve(pedidosPagos);
        if (entity === Costo) return Promise.resolve(costosPagos);
        return Promise.resolve([]);
      }),
      create: jest.fn((entityClass: any, data: any) => {
        const instance = new entityClass();
        Object.assign(instance, data);
        return instance;
      }),
      persistAndFlush: jest.fn().mockResolvedValue(undefined as any),
    };
  });

  it('debe crear movimientos financieros para ventas, pedidos y costos pagos', async () => {
    const seeder = new MovimientoSeeder();
    await seeder.run(mockEm);

    expect(mockEm.persistAndFlush).toHaveBeenCalledTimes(1);
    const movsGuardados: MovF[] = mockEm.persistAndFlush.mock.calls[0][0];

    // 2 ventas + 1 pedido + 1 costo = 4 movimientos
    expect(movsGuardados).toHaveLength(4);

    // 1. Movimiento de Venta 1 (Ingreso)
    expect(movsGuardados[0].tipo).toBe('Ingreso');
    expect(movsGuardados[0].categoria).toBe('venta');
    expect(movsGuardados[0].monto).toBe(200);
    expect(movsGuardados[0].venta).toBe(ventasPagas[0]);
    expect(movsGuardados[0].caja).toBe(caja);
    expect(movsGuardados[0].cod).toBe('PA_1');

    // 2. Movimiento de Venta 2 (Ingreso)
    expect(movsGuardados[1].tipo).toBe('Ingreso');
    expect(movsGuardados[1].monto).toBe(100);
    expect(movsGuardados[1].venta).toBe(ventasPagas[1]);
    expect(movsGuardados[1].cod).toBe('PA_2');

    // 3. Movimiento de Pedido 1 (Egreso)
    expect(movsGuardados[2].tipo).toBe('Egreso');
    expect(movsGuardados[2].categoria).toBe('pedido');
    expect(movsGuardados[2].monto).toBe(1500);
    expect(movsGuardados[2].pedido).toBe(pedidosPagos[0]);
    expect(movsGuardados[2].cod).toBe('PA_3');

    // 4. Movimiento de Costo 1 (Egreso)
    expect(movsGuardados[3].tipo).toBe('Egreso');
    expect(movsGuardados[3].categoria).toBe('Impuesto');
    expect(movsGuardados[3].monto).toBe(200);
    expect(movsGuardados[3].costo).toBe(costosPagos[0]);
    expect(movsGuardados[3].cod).toBe('PA_4');
  });

  it('no debe insertar movimientos si ya existen movimientos en la base de datos (idempotencia)', async () => {
    mockEm.find.mockImplementation((entity: any) => {
      if (entity === MovF) return Promise.resolve([new MovF()]); // Ya existen
      return Promise.resolve([]);
    });

    const seeder = new MovimientoSeeder();
    await seeder.run(mockEm);

    expect(mockEm.create).not.toHaveBeenCalled();
    expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
  });
});
