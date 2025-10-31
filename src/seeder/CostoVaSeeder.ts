import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Moneda } from "../entities/Moneda.entities.js";
import { CostoVariable } from "../entities/Costovariable.entities.js";

export class CostoVariableSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const moneda = await em.findOne(Moneda, {id:1, usuario:{id:1}});
        const moneda_2 = await em.findOne(Moneda, {id:2, usuario:{id:1}});
        const moneda_3 = await em.findOne(Moneda, {id:3, usuario:{id:1}});
        if (!usuario || !moneda || !moneda_2 || !moneda_3) {
            throw new Error('Usuario o moneda no encontrado');
        }
        const costos_variables = await em.find(CostoVariable, {});
        if (costos_variables.length > 0) {
            return;
        }
        await em.insertMany(CostoVariable, [
            { codigo: '1', usuario: usuario, moneda: moneda, monto: 200, nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, adjudicacion: 'TGI', categoria: 'Impuesto', cantidad: 10, precio_unitario: 20, unidad: 'USD', monto_pagado: 200, estado: 'Pagada' },
            { codigo: '2', usuario: usuario, moneda: moneda_2, monto: 100, nombre_moneda: moneda_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, adjudicacion: 'API', categoria: 'Impuesto', cantidad: 10, precio_unitario: 10, unidad: 'ARS', monto_pagado: 0, estado: 'Pendiente' },
            { codigo: '3', usuario: usuario, moneda: moneda_3, monto: 500, nombre_moneda: moneda_3.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, adjudicacion: 'GAS', categoria: 'Servicio', cantidad: 10, precio_unitario: 50, unidad: 'EUR', monto_pagado: 0, estado: 'Pendiente' },
            { codigo: '4', usuario: usuario, moneda: moneda, monto: 1000, nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, adjudicacion: 'AGUA', categoria: 'Servicio', cantidad: 10, precio_unitario: 100, unidad: 'USD', monto_pagado: 1000, estado: 'Pagada' },
            { codigo: '5', usuario: usuario, moneda: moneda_2, monto: 1000, nombre_moneda: moneda_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, adjudicacion: 'TELEFONO', categoria: 'Servicio', cantidad: 10, precio_unitario: 100, unidad: 'ARS', monto_pagado: 500, estado: 'Pendiente' },
        ]);
    }
}