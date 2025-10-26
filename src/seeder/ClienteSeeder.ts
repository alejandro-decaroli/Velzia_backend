// seeders/UserSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { Cliente } from '../entities/Cliente.entities.js';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario.entities.js';

export class ClienteSeeder extends Seeder {
  async run(em: EntityManager) {
    const usuario = await em.findOne(Usuario, {id:1});
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const clientes = await em.find(Cliente, {});
    if (clientes.length > 0) {
      return;
    }
    await em.insertMany(Cliente, [
      { codigo: '1', nombre: 'Alejandro', apellido: 'Garcia', email: 'alejandro@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '2', nombre: 'Gonzalo', apellido: 'Garcia', email: 'gonzalo@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '3', nombre: 'Juan', apellido: 'Garcia', email: 'juan@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '4', nombre: 'Pedro', apellido: 'Garcia', email: 'pedro@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '5', nombre: 'Maria', apellido: 'Garcia', email: 'maria@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '6', nombre: 'Luis', apellido: 'Garcia', email: 'luis@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '7', nombre: 'Ana', apellido: 'Garcia', email: 'ana@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '8', nombre: 'Pepe', apellido: 'Garcia', email: 'pepe@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '9', nombre: 'Sumire', apellido: 'Garcia', email: 'sumire@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
      { codigo: '10', nombre: 'Anabela', apellido: 'Garcia', email: 'anabela@example.com', telefono: '123456789', 
        visible: true, creadoEn: new Date(), actualizadoEn: new Date(), direccion: '123 Main St', usuario: usuario},
    ]);
  }
}