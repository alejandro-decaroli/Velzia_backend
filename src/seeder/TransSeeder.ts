import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Transferencia } from "../entities/Transferencia.entities.js";

export class TransferenciaSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const caja_1 = await em.findOne(Caja, {id:1, usuario:{id:1}});
        const caja_2 = await em.findOne(Caja, {id:2, usuario:{id:1}});
        const caja_3 = await em.findOne(Caja, {id:3, usuario:{id:1}});
        const caja_4 = await em.findOne(Caja, {id:4, usuario:{id:1}});
        if (!usuario || !caja_1 || !caja_2 || !caja_3 || !caja_4) {
            throw new Error('Usuario o caja no encontrado');
        }
        const transferencias = await em.find(Transferencia, {});
        if (transferencias.length > 0) {
            return;
        }
        await em.insertMany(Transferencia, [
            { cod: 'TR_1', usuario: usuario, caja_origen: caja_1, caja_destino: caja_3, motivo: 'Transferencia de caja 1 a caja 3', monto: 1000, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'TR_2', usuario: usuario, caja_origen: caja_2, caja_destino: caja_4, motivo: 'Transferencia de caja 2 a caja 4', monto: 1000, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'TR_3', usuario: usuario, caja_origen: caja_3, caja_destino: caja_1, motivo: 'Transferencia de caja 3 a caja 1', monto: 500, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'TR_4', usuario: usuario, caja_origen: caja_4, caja_destino: caja_2, motivo: 'Transferencia de caja 4 a caja 2', monto: 500, creadoEn: new Date(), actualizadoEn: new Date() },
        ]);
    }
}
    