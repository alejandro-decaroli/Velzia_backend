// seeders/UserSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { Moneda } from '../entities/Moneda.entities.js';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario.entities.js';

export class MonedaSeeder extends Seeder {
  async run(em: EntityManager) {
    const usuario = await em.findOne(Usuario, {id:1});
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const monedas = await em.find(Moneda, {});
    if (monedas.length > 0) {
      return;
    }
    await em.insertMany(Moneda, [
      { codigo: '1', nombre: 'Dolar', codigo_iso: 'USD', visible: true, principal: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
      { codigo: '2', nombre: 'Peso', codigo_iso: 'ARS', visible: true, principal: false, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
      { codigo: '3', nombre: 'Euro', codigo_iso: 'EUR', visible: true, principal: false, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario},
    ]);
  }
}