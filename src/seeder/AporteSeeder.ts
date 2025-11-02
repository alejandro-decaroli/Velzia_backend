import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Aporte } from "../entities/Aporte.entities.js";

export class AporteSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const caja_1 = await em.findOne(Caja, {id:1, usuario:{id:1}});
        const caja_2 = await em.findOne(Caja, {id:2, usuario:{id:1}});
        const caja_3 = await em.findOne(Caja, {id:3, usuario:{id:1}});
        const caja_4 = await em.findOne(Caja, {id:4, usuario:{id:1}});
        const caja_5 = await em.findOne(Caja, {id:5, usuario:{id:1}});
        if (!usuario || !caja_1 || !caja_2 || !caja_3 || !caja_4 || !caja_5) {
            throw new Error('Usuario o caja no encontrado');
        }
        const aportes = await em.find(Aporte, {});
        if (aportes.length > 0) {
            return;
        }
        await em.insertMany(Aporte, [
            {cod: 'AP_1', usuario: usuario, caja: caja_1, monto: 10000, creadoEn: new Date(), actualizadoEn: new Date() },
            {cod: 'AP_2', usuario: usuario, caja: caja_2, monto: 10000, creadoEn: new Date(), actualizadoEn: new Date() },
            {cod: 'AP_3', usuario: usuario, caja: caja_3, monto: 10000, creadoEn: new Date(), actualizadoEn: new Date() },
            {cod: 'AP_4', usuario: usuario, caja: caja_4, monto: 10000, creadoEn: new Date(), actualizadoEn: new Date() },
            {cod: 'AP_5', usuario: usuario, caja: caja_5, monto: 10000, creadoEn: new Date(), actualizadoEn: new Date() },
        ]);
    }
}
    