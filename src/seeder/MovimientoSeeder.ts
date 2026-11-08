import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Venta } from "../entities/Venta.entities.js";
import { Pedido } from "../entities/Pedido.entities.js";
import { Costo } from "../entities/Costo.entities.js";
import { MovF } from "../entities/MovF.entities.js";

export class MovimientoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuario = await em.findOne(Usuario, { id: 1 });
    const caja = (await em.findOne(Caja, { cod: 'CA_1' })) || (await em.findOne(Caja, { id: 1 }));

    if (!usuario || !caja) {
      throw new Error('Usuario o Caja no encontrados para MovimientoSeeder');
    }

    const movsExistentes = await em.find(MovF, {});
    if (movsExistentes.length > 0) {
      return;
    }

    const ventasPagas = await em.find(Venta, {
      usuario,
      estado: { $in: ['Paga', 'Pagada', 'Pagado', 'Pago'] },
    });

    const pedidosPagos = await em.find(Pedido, {
      usuario,
      estado: { $in: ['Pagado', 'Paga', 'Pagada', 'Pago'] },
    });

    const costosPagos = await em.find(Costo, {
      usuario,
      estado: { $in: ['Pagada', 'Pagado', 'Paga', 'Pago'] },
    });

    let contador = 1;
    const movimientos: MovF[] = [];

    for (const venta of ventasPagas) {
      const mov = em.create(MovF, {
        cod: `PA_${contador++}`,
        tipo: 'Ingreso',
        categoria: 'venta',
        descripcion: `Cobro de venta ${venta.cod || ('#' + venta.id)}`,
        monto: Number(venta.total),
        caja,
        venta,
        usuario,
        creadoEn: venta.creadoEn || new Date(),
        actualizadoEn: venta.actualizadoEn || new Date(),
      });
      movimientos.push(mov);
    }

    for (const pedido of pedidosPagos) {
      const mov = em.create(MovF, {
        cod: `PA_${contador++}`,
        tipo: 'Egreso',
        categoria: 'pedido',
        descripcion: `Pago de pedido ${pedido.cod || ('#' + pedido.id)}`,
        monto: Number(pedido.total),
        caja,
        pedido,
        usuario,
        creadoEn: pedido.creadoEn || new Date(),
        actualizadoEn: pedido.actualizadoEn || new Date(),
      });
      movimientos.push(mov);
    }

    for (const costo of costosPagos) {
      const mov = em.create(MovF, {
        cod: `PA_${contador++}`,
        tipo: 'Egreso',
        categoria: costo.categoria || 'costo',
        descripcion: `Pago de costo ${costo.descripcion || costo.cod || costo.id}`,
        monto: Number(costo.monto),
        caja,
        costo,
        usuario,
        creadoEn: costo.creadoEn || new Date(),
        actualizadoEn: costo.actualizadoEn || new Date(),
      });
      movimientos.push(mov);
    }

    await em.persistAndFlush(movimientos);
  }
}

export const MovFSeeder = MovimientoSeeder;
