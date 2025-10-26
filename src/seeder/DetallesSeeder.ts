import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Venta } from "../entities/Venta.entities.js";
import { Detalle } from "../entities/Detalle.entities.js";
import { Producto } from "../entities/Producto.entities.js";

export class DetalleSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        const venta_1 = await em.findOne(Venta, {id:1, usuario:{id:1}});
        const venta_2 = await em.findOne(Venta, {id:2, usuario:{id:1}});
        const venta_3 = await em.findOne(Venta, {id:3, usuario:{id:1}});
        const venta_4 = await em.findOne(Venta, {id:4, usuario:{id:1}});
        const venta_5 = await em.findOne(Venta, {id:5, usuario:{id:1}});
        const producto_1 = await em.findOne(Producto, {id:1, usuario:{id:1}});
        const producto_2 = await em.findOne(Producto, {id:2, usuario:{id:1}});
        const producto_3 = await em.findOne(Producto, {id:3, usuario:{id:1}});
        const producto_4 = await em.findOne(Producto, {id:4, usuario:{id:1}});
        const producto_5 = await em.findOne(Producto, {id:5, usuario:{id:1}});
        if (!usuario || !venta_1 || !venta_2 || !venta_3 || !venta_4 || !venta_5 || !producto_1 || !producto_2 || !producto_3 || !producto_4 || !producto_5) {
            throw new Error('Usuario o venta no encontrado');
        }
        const detalles = await em.find(Detalle, {});
        if (detalles.length > 0) {
            return;
        }
        await em.insertMany(Detalle, [
            { codigo: '1', usuario: usuario, venta: venta_1, producto: producto_1, precio_unitario: 100, descuento:0, cantidad: 2, subtotal: 200, creadoEn: new Date(), actualizadoEn: new Date(), visible: true },
            { codigo: '2', usuario: usuario, venta: venta_2, producto: producto_2, precio_unitario: 10, descuento:0, cantidad: 10, subtotal: 100,creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { codigo: '3', usuario: usuario, venta: venta_3, producto: producto_3, precio_unitario: 100, descuento:0, cantidad: 5, subtotal: 500,creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { codigo: '4', usuario: usuario, venta: venta_4, producto: producto_4, precio_unitario: 25, descuento:0, cantidad: 4, subtotal: 100,creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
            { codigo: '5', usuario: usuario, venta: venta_5, producto: producto_5, precio_unitario: 20, descuento:0, cantidad: 5, subtotal: 100,creadoEn: new Date(), actualizadoEn: new Date(), visible: true},
        ]);
    }
}