import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Transferencia } from "../entities/Transferencia.entities.js";

export class TransferenciaSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, 1);
        const caja_1 = await em.findOne(Caja, 1);
        const caja_2 = await em.findOne(Caja, 2);
        const caja_3 = await em.findOne(Caja, 3);
        const caja_4 = await em.findOne(Caja, 4);
        if (!usuario || !caja_1 || !caja_2 || !caja_3 || !caja_4) {
            throw new Error('Usuario o caja no encontrado');
        }
        await em.insertMany(Transferencia, [
            { usuario: usuario, caja_origen: caja_1, caja_destino: caja_3, monto: 1000, nombre_caja_origen: caja_1.nombre, nombre_caja_destino: caja_3.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, motivo: 'Transferencia de caja 1 a caja 3' },
            { usuario: usuario, caja_origen: caja_2, caja_destino: caja_4, monto: 1000, nombre_caja_origen: caja_2.nombre, nombre_caja_destino: caja_4.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, motivo: 'Transferencia de caja 2 a caja 4' },
            { usuario: usuario, caja_origen: caja_3, caja_destino: caja_1, monto: 500, nombre_caja_origen: caja_3.nombre, nombre_caja_destino: caja_1.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, motivo: 'Transferencia de caja 3 a caja 1' },
            { usuario: usuario, caja_origen: caja_4, caja_destino: caja_2, monto: 500, nombre_caja_origen: caja_4.nombre, nombre_caja_destino: caja_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, motivo: 'Transferencia de caja 4 a caja 2' },
        ]);
    }
}
    