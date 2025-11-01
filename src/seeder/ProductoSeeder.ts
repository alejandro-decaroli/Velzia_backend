import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Usuario } from "../entities/Usuario.entities.js";
import { Producto } from "../entities/Producto.entities.js";

export class ProductoSeeder extends Seeder {
    async run(em: EntityManager) {
        const usuario = await em.findOne(Usuario, {id:1});
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const productos = await em.find(Producto, {});
        if (productos.length > 0) {
            return;
        }
        await em.insertMany(Producto, [
            { cod: 'PO_1', usuario: usuario, nombre: 'Manzana', descripcion: 'Manzana', stock: 10, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_2', usuario: usuario, nombre: 'Banana', descripcion: 'Banana', stock: 20, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_3', usuario: usuario, nombre: 'Pera', descripcion: 'Pera', stock: 30, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_4', usuario: usuario, nombre: 'Uva', descripcion: 'Uva', stock: 40, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_5', usuario: usuario, nombre: 'Mango', descripcion: 'Mango', stock: 50, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_6', usuario: usuario, nombre: 'Mandarina', descripcion: 'Mandarina', stock: 60, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_7', usuario: usuario, nombre: 'Mora', descripcion: 'Mora', stock: 70, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_8', usuario: usuario, nombre: 'Piña', descripcion: 'Piña', stock: 80, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_9', usuario: usuario, nombre: 'Guayaba', descripcion: 'Guayaba', stock: 90, creadoEn: new Date(), actualizadoEn: new Date() },
            { cod: 'PO_10', usuario: usuario, nombre: 'Sandía', descripcion: 'Sandía', stock: 100, creadoEn: new Date(), actualizadoEn: new Date() },
        ]);
    }
}
    