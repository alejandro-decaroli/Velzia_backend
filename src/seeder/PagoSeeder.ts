import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Moneda } from "../entities/Moneda.entities.js";
import { Pago } from "../entities/Pago.entities.js";
import { CostoFijo } from "../entities/Costofijo.entities.js";
import { CostoVariable } from "../entities/Costovariable.entities.js";
import { Caja } from "../entities/Caja.entities.js";
import { Cliente } from "../entities/Cliente.entities.js";
import { Venta } from "../entities/Venta.entities.js";


export class PagoSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const moneda = await em.findOne(Moneda, {id:1, usuario:{id:1}});
        const moneda_2 = await em.findOne(Moneda, {id:2, usuario:{id:1}});
        const moneda_3 = await em.findOne(Moneda, {id:3, usuario:{id:1}});
        if (!usuario || !moneda || !moneda_2 || !moneda_3) {
            throw new Error('Usuario o moneda no encontrado');
        }
        const caja = await em.findOne(Caja, {id:1, usuario:{id:1}});
        const caja_2 = await em.findOne(Caja, {id:2, usuario:{id:1}});
        const caja_3 = await em.findOne(Caja, {id:3, usuario:{id:1}});
        if (!caja || !caja_2 || !caja_3) {
            throw new Error('Caja no encontrada');
        }
        const venta = await em.findOne(Venta, {id:1, usuario:{id:1}});
        const venta_2 = await em.findOne(Venta, {id:2, usuario:{id:1}});
        const venta_3 = await em.findOne(Venta, {id:3, usuario:{id:1}});
        const costo_fijo_1 = await em.findOne(CostoFijo, {id:1, usuario:{id:1}});
        const costo_variable_1 = await em.findOne(CostoVariable, {id:1, usuario:{id:1}});
        const costo_fijo_2 = await em.findOne(CostoFijo, {id:4, usuario:{id:1}});
        const costo_variable_2 = await em.findOne(CostoVariable, {id:4, usuario:{id:1}});
        const costo_variable_3 = await em.findOne(CostoVariable, {id:5, usuario:{id:1}});
        const costo_fijo_3 = await em.findOne(CostoFijo, {id:5, usuario:{id:1}});
        if (!venta || !venta_2 || !venta_3 || !costo_fijo_1 || !costo_variable_1 || !costo_fijo_2 || !costo_variable_2 || !costo_variable_3 || !costo_fijo_3) {
            throw new Error('Venta o costo no encontrada');
        }
        const pagos = await em.find(Pago, {});
        if (pagos.length > 0) {
            return;
        }

        await em.insertMany(Pago, [
            { cod: 'PA_1', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 200, venta: venta },
            { cod: 'PA_2', usuario: usuario, caja: caja_2, creadoEn: new Date(), actualizadoEn: new Date(), monto: 100, venta: venta_2 },
            { cod: 'PA_3', usuario: usuario, caja: caja_3, creadoEn: new Date(), actualizadoEn: new Date(), monto: 500, venta: venta_3 },
            { cod: 'PA_4', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 200, costo_fijo: costo_fijo_1 },
            { cod: 'PA_5', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 1000, costo_fijo: costo_fijo_2 },
            { cod: 'PA_6', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 200, costo_variable: costo_variable_1 },
            { cod: 'PA_7', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 1000, costo_variable: costo_variable_2 },
            { cod: 'PA_8', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 500, costo_variable: costo_variable_3 },
            { cod: 'PA_9', usuario: usuario, caja: caja, creadoEn: new Date(), actualizadoEn: new Date(), monto: 500, costo_fijo: costo_fijo_3 },
        ]);
    }
}