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
        if (!venta || !venta_2 || !venta_3) {
            throw new Error('Venta no encontrada');
        }
        const pagos = await em.find(Pago, {});
        if (pagos.length > 0) {
            return;
        }

        await em.insertMany(Pago, [
            { codigo: '1', usuario: usuario, caja: caja, nombre_caja: caja.nombre, nombre_cliente: venta.nombre_cliente, nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 200, id_costo_fijo: 'No asociado', id_costo_variable: 'No asociado', id_venta: venta.id.toString(), venta: venta },
            { codigo: '2', usuario: usuario, caja: caja_2, nombre_caja: caja_2.nombre, nombre_cliente: venta_2.nombre_cliente, nombre_moneda: moneda_2.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 100, id_costo_fijo: 'No asociado', id_costo_variable: 'No asociado', id_venta: venta_2.id.toString(), venta: venta_2 },
            { codigo: '3', usuario: usuario, caja: caja_3, nombre_caja: caja_3.nombre, nombre_cliente: venta_3.nombre_cliente, nombre_moneda: moneda_3.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 500, id_costo_fijo: 'No asociado', id_costo_variable: 'No asociado', id_venta: venta_3.id.toString(), venta: venta_3 },
            { codigo: '4', usuario: usuario, caja: caja, nombre_caja: caja.nombre, nombre_cliente: 'No asociado', nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 200, id_costo_fijo: '1', id_costo_variable: 'No asociado', id_venta: 'No asociado' },
            { codigo: '5', usuario: usuario, caja: caja, nombre_caja: caja.nombre, nombre_cliente: 'No asociado', nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 1000, id_costo_fijo: '4', id_costo_variable: 'No asociado', id_venta: 'No asociado' },
            { codigo: '6', usuario: usuario, caja: caja, nombre_caja: caja.nombre, nombre_cliente: 'No asociado', nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 200, id_costo_fijo: 'No asociado', id_costo_variable: '1', id_venta: 'No asociado' },
            { codigo: '7', usuario: usuario, caja: caja, nombre_caja: caja.nombre, nombre_cliente: 'No asociado', nombre_moneda: moneda.nombre, creadoEn: new Date(), actualizadoEn: new Date(), visible: true, monto: 1000, id_costo_fijo: 'No asociado', id_costo_variable: '4', id_venta: 'No asociado' },
        ]);
    }
}