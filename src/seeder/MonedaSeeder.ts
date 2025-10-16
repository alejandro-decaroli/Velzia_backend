// seeders/UserSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { Moneda } from '../entities/Moneda.entities.js';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario.entities.js';

export class MonedaSeeder extends Seeder {
  async run(em: EntityManager) {
    const usuario = await em.findOne(Usuario, 1);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    await em.insertMany(Moneda, [
      { nombre: 'Peso', codigo_iso: 'ARS', visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
      { nombre: 'Dolar', codigo_iso: 'USD', visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
      { nombre: 'Euro', codigo_iso: 'EUR', visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
    ]);
  }
}