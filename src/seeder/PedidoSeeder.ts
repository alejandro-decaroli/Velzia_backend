import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Pedido } from '../entities/Pedido.entities.js';
import { Proveedor } from '../entities/Proveedor.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';

export class PedidoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuario = await em.findOne(Usuario, { id: 1 });
    const proveedor1 = await em.findOne(Proveedor, { id: 1 });
    const proveedor2 = await em.findOne(Proveedor, { id: 2 });
    const proveedor3 = await em.findOne(Proveedor, { id: 3 });

    if (!usuario || !proveedor1 || !proveedor2 || !proveedor3) {
      throw new Error('Usuario o proveedores no encontrados para PedidoSeeder');
    }

    const pedidos = await em.find(Pedido, {});
    if (pedidos.length > 0) {
      return;
    }

    const hoy = new Date();
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const haceTresDias = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await em.insertMany(Pedido, [
      {
        cod: 'PE_1',
        proveedor: proveedor1,
        fecha_emision: haceUnaSemana,
        fecha_recepcion: haceTresDias,
        total: 1500,
        estado: 'Pagado',
        usuario: usuario,
        creadoEn: haceUnaSemana,
        actualizadoEn: haceTresDias,
      },
      {
        cod: 'PE_2',
        proveedor: proveedor2,
        fecha_emision: haceTresDias,
        fecha_recepcion: ayer,
        total: 800,
        estado: 'Pagado',
        usuario: usuario,
        creadoEn: haceTresDias,
        actualizadoEn: ayer,
      },
      {
        cod: 'PE_3',
        proveedor: proveedor1,
        fecha_emision: ayer,
        fecha_recepcion: undefined,
        total: 1200,
        estado: 'Pendiente',
        usuario: usuario,
        creadoEn: ayer,
        actualizadoEn: ayer,
      },
      {
        cod: 'PE_4',
        proveedor: proveedor3,
        fecha_emision: hoy,
        fecha_recepcion: undefined,
        total: 2500,
        estado: 'Pendiente',
        usuario: usuario,
        creadoEn: hoy,
        actualizadoEn: hoy,
      },
      {
        cod: 'PE_5',
        proveedor: proveedor2,
        fecha_emision: hoy,
        fecha_recepcion: undefined,
        total: 950,
        estado: 'Pendiente',
        usuario: usuario,
        creadoEn: hoy,
        actualizadoEn: hoy,
      },
    ]);
  }
}
