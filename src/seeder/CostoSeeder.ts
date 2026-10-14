import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Costo } from "../entities/Costo.entities.js";

export class CostoSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, { id: 1 });
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const costos = await em.find(Costo, {});
        if (costos.length > 0) {
            return;
        }
        await em.insertMany(Costo, [
            { cod: 'CO_1', usuario: usuario, monto: 200, creadoEn: new Date(), actualizadoEn: new Date(), descripcion: 'TGI', categoria: 'Impuesto', estado: 'Pagada' },
            { cod: 'CO_2', usuario: usuario, monto: 100, creadoEn: new Date(), actualizadoEn: new Date(), descripcion: 'API', categoria: 'Impuesto', estado: 'Pendiente' },
            { cod: 'CO_3', usuario: usuario, monto: 500, creadoEn: new Date(), actualizadoEn: new Date(), descripcion: 'GAS', categoria: 'Servicio', estado: 'Pendiente' },
            { cod: 'CO_4', usuario: usuario, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date(), descripcion: 'AGUA', categoria: 'Servicio', estado: 'Pagada' },
            { cod: 'CO_5', usuario: usuario, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date(), descripcion: 'TELEFONO', categoria: 'Servicio', estado: 'Pendiente' },
        ]);
    }
}

export const CostoFijoSeeder = CostoSeeder;