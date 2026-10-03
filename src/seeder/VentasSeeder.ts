import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Venta } from "../entities/Venta.entities.js";
import { Cliente } from "../entities/Cliente.entities.js";

export class VentaSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const cliente_1 = await em.findOne(Cliente, {id:1, usuario:{id:1}});
        const cliente_2 = await em.findOne(Cliente, {id:2, usuario:{id:1}});
        const cliente_3 = await em.findOne(Cliente, {id:3, usuario:{id:1}});
        const cliente_4 = await em.findOne(Cliente, {id:4, usuario:{id:1}});
        const cliente_5 = await em.findOne(Cliente, {id:5, usuario:{id:1}});
        if (!usuario || !cliente_1 || !cliente_2 || !cliente_3 || !cliente_4 || !cliente_5) {
            throw new Error('Usuario o cliente no encontrado');
        }
        const ventas = await em.find(Venta, {});
        if (ventas.length > 0) {
            return;
        }
        await em.insertMany(Venta, [
            { cod: 'VE_1', usuario: usuario, total: 200, total_pagado: 200, estado: 'Paga', cliente: cliente_1, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'VE_2', usuario: usuario, total: 100, total_pagado: 100, estado: 'Paga', cliente: cliente_2, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'VE_3', usuario: usuario, total: 500, total_pagado: 500, estado: 'Paga', cliente: cliente_3, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'VE_4', usuario: usuario, total: 100, total_pagado: 0, estado: 'Pendiente', cliente: cliente_4, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'VE_5', usuario: usuario, total: 100, total_pagado: 0, estado: 'Pendiente', cliente: cliente_5, creadoEn: new Date(), actualizadoEn: new Date() },
        ]);
    }
}