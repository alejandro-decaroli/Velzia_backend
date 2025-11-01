import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Dividendo } from "../entities/Dividendo.entities.js";

export class DividendoSeeder extends Seeder {
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
        const dividendos_socio = await em.find(Dividendo, {});
        if (dividendos_socio.length > 0) {
            return;
        }
        await em.insertMany(Dividendo, [
            { cod: 'DI_1', usuario: usuario, caja: caja_1, monto: 200, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'DI_2', usuario: usuario, caja: caja_2, monto: 100, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'DI_3', usuario: usuario, caja: caja_3, monto: 500, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'DI_4', usuario: usuario, caja: caja_4, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'DI_5', usuario: usuario, caja: caja_1, monto: 1000, creadoEn: new Date(), actualizadoEn: new Date() },
        ]);
    }
}
    