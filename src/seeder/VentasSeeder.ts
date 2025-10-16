import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Moneda } from "../entities/Moneda.entities.js";
import { Venta } from "../entities/Venta.entities.js";
import { Cliente } from "../entities/Cliente.entities.js";

export class VentaSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, 1);
        const moneda = await em.findOne(Moneda, 1);
        const moneda_2 = await em.findOne(Moneda, 2);
        const moneda_3 = await em.findOne(Moneda, 3);
        const cliente_1 = await em.findOne(Cliente, 1);
        const cliente_2 = await em.findOne(Cliente, 2);
        const cliente_3 = await em.findOne(Cliente, 3);
        const cliente_4 = await em.findOne(Cliente, 4);
        const cliente_5 = await em.findOne(Cliente, 5);
        if (!usuario || !moneda || !moneda_2 || !moneda_3 || !cliente_1 || !cliente_2 || !cliente_3 || !cliente_4 || !cliente_5) {
            throw new Error('Usuario o moneda no encontrado');
        }
        await em.insertMany(Venta, [
            { usuario: usuario, moneda: moneda, total: 200, total_pagado: 200, estado: 'Paga', nombre_cliente: cliente_1.nombre, apellido_cliente: cliente_1.apellido, moneda_asociada: moneda.codigo_iso, cliente: cliente_1, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { usuario: usuario, moneda: moneda_2, total: 100, total_pagado: 100, estado: 'Paga', nombre_cliente: cliente_2.nombre, apellido_cliente: cliente_2.apellido, moneda_asociada: moneda_2.codigo_iso, cliente: cliente_2, creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { usuario: usuario, moneda: moneda_3, total: 500, total_pagado: 500, estado: 'Paga', nombre_cliente: cliente_3.nombre, apellido_cliente: cliente_3.apellido, moneda_asociada: moneda_3.codigo_iso, cliente: cliente_3, creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { usuario: usuario, moneda: moneda, total: 100, total_pagado: 0, estado: 'Pendiente', nombre_cliente: cliente_4.nombre, apellido_cliente: cliente_4.apellido, moneda_asociada: moneda.codigo_iso, cliente: cliente_4, creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { usuario: usuario, moneda: moneda_2, total: 100, total_pagado: 0, estado: 'Pendiente', nombre_cliente: cliente_5.nombre, apellido_cliente: cliente_5.apellido, moneda_asociada: moneda_2.codigo_iso, cliente: cliente_5, creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
        ]);
    }
}