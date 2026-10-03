import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { CostoFijo } from "../entities/Costofijo.entities.js";

export class CostoFijoSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const costos_fijos = await em.find(CostoFijo, {});
        if (costos_fijos.length > 0) {
            return;
        }
        await em.insertMany(CostoFijo, [
            { cod: 'CF_1', usuario: usuario, monto: 200, creadoEn: new Date(), actualizadoEn: new Date(), adjudicacion: 'TGI', categoria: 'Impuesto', monto_pagado: 200, estado: 'Pagada' },
            { cod: 'CF_2', usuario: usuario, monto: 100, creadoEn: new Date(), actualizadoEn: new Date(), adjudicacion: 'API', categoria: 'Impuesto', monto_pagado: 0, estado: 'Pendiente' },
            { cod: 'CF_3', usuario: usuario, monto: 500, creadoEn: new Date(), actualizadoEn: new Date(), adjudicacion: 'GAS', categoria:'Servicio', monto_pagado: 0, estado: 'Pendiente' },
            { cod: 'CF_4', usuario: usuario, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date(), adjudicacion: 'AGUA', categoria:'Servicio', monto_pagado: 1000, estado: 'Pagada' },
            { cod: 'CF_5', usuario: usuario, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date(), adjudicacion: 'TELEFONO', categoria:'Servicio', monto_pagado: 500, estado: 'Pendiente' },
        ]);
    }
}
    