import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Tasa } from "../entities/Tasa.entities.js";
import { Moneda } from "../entities/Moneda.entities.js";

export class TasaSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const moneda = await em.findOne(Moneda, {id:1, usuario:{id:1}});
        const moneda_2 = await em.findOne(Moneda, {id:2, usuario:{id:1}});
        const moneda_3 = await em.findOne(Moneda, {id:3, usuario:{id:1}});
        if (!usuario || !moneda || !moneda_2 || !moneda_3) {
            throw new Error('Usuario no encontrado');
        }
        await em.insertMany(Tasa, [
            { usuario: usuario, moneda_origen: moneda, moneda_destino: moneda_2, tasa: 2, nombre_moneda_origen: moneda.nombre, nombre_moneda_destino: moneda_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { usuario: usuario, moneda_origen: moneda, moneda_destino: moneda_3, tasa: 2, nombre_moneda_origen: moneda.nombre, nombre_moneda_destino: moneda_3.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
        ]);
    }
}
    