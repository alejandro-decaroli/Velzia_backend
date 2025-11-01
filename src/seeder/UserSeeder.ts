// seeders/UserSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { Usuario } from '../entities/Usuario.entities.js';
import { hash } from 'bcrypt';
import { EntityManager } from '@mikro-orm/core';

export class UserSeeder extends Seeder {
  async run(em: EntityManager) {
    const users = await em.find(Usuario, {});
    if (users.length > 0) {
      return;
    }
    await em.insertMany(Usuario, [
      { nombre: 'Alejandro', apellido: 'Garcia', email: 'alejandro@example.com', contrasenia: await hash('123456', 10), 
        rol: 'admin', creadoEn: new Date(), actualizadoEn: new Date() },
      { nombre: 'Gonzalo', apellido: 'Garcia', email: 'gonzalo@example.com', contrasenia: await hash('123456', 10), 
        rol: 'user', creadoEn: new Date(), actualizadoEn: new Date() },
      { nombre: 'Juan', apellido: 'Garcia', email: 'juan@example.com', contrasenia: await hash('123456', 10), 
        rol: 'user', creadoEn: new Date(), actualizadoEn: new Date() },
      { nombre: 'Pedro', apellido: 'Garcia', email: 'pedro@example.com', contrasenia: await hash('123456', 10), 
        rol: 'user', creadoEn: new Date(), actualizadoEn: new Date() },
      { nombre: 'Maria', apellido: 'Garcia', email: 'maria@example.com', contrasenia: await hash('123456', 10), 
        rol: 'user', creadoEn: new Date(), actualizadoEn: new Date() },
    ]);
  }
}
