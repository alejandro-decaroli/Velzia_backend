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
            { codigo: '1', usuario: usuario, caja: caja_1, monto: 200, nombre_caja: caja_1.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { codigo: '2', usuario: usuario, caja: caja_2, monto: 100, nombre_caja: caja_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { codigo: '3', usuario: usuario, caja: caja_3, monto: 500, nombre_caja: caja_3.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { codigo: '4', usuario: usuario, caja: caja_4, monto: 1000, nombre_caja: caja_4.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { codigo: '5', usuario: usuario, caja: caja_1, monto: 1000, nombre_caja: caja_1.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
        ]);
    }
}
    