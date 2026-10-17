import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { LineaPedido } from '../entities/LineaPedido.entities.js';
import { Pedido } from '../entities/Pedido.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';

export class LineaPedidoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuario = await em.findOne(Usuario, { id: 1 });
    const pedido1 = await em.findOne(Pedido, { id: 1 });
    const pedido2 = await em.findOne(Pedido, { id: 2 });
    const pedido3 = await em.findOne(Pedido, { id: 3 });
    const pedido4 = await em.findOne(Pedido, { id: 4 });
    const pedido5 = await em.findOne(Pedido, { id: 5 });

    const producto1 = await em.findOne(Producto, { id: 1 });
    const producto2 = await em.findOne(Producto, { id: 2 });
    const producto3 = await em.findOne(Producto, { id: 3 });
    const producto4 = await em.findOne(Producto, { id: 4 });

    if (!usuario || !pedido1 || !pedido2 || !pedido3) {
      throw new Error('Usuario o pedidos no encontrados para LineaPedidoSeeder');
    }

    if (!producto1 || !producto2 || !producto3 || !producto4) {
      throw new Error('Productos no encontrados para LineaPedidoSeeder');
    }

    const lineas = await em.find(LineaPedido, {});
    if (lineas.length > 0) {
      return;
    }

    await em.insertMany(LineaPedido, [
      {
        cod: 'LP_1',
        pedido: pedido1,
        producto: producto1,
        cantidad: 15,
        precio: 50,
        subtotal: 750,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'LP_2',
        pedido: pedido1,
        producto: producto2,
        cantidad: 15,
        precio: 50,
        subtotal: 750,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'LP_3',
        pedido: pedido2,
        producto: producto3,
        cantidad: 10,
        precio: 80,
        subtotal: 800,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'LP_4',
        pedido: pedido3,
        producto: producto1,
        cantidad: 20,
        precio: 60,
        subtotal: 1200,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'LP_5',
        pedido: pedido4 ? pedido4 : pedido1,
        producto: producto4,
        cantidad: 25,
        precio: 100,
        subtotal: 2500,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
    ]);
  }
}
