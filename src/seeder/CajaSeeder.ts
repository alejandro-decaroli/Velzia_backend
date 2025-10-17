// seeders/UserSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { Caja } from '../entities/Caja.entities.js';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';

export class CajaSeeder extends Seeder {
  async run(em: EntityManager) {
    const usuario = await em.findOne(Usuario, {id:1});
    const moneda_dolar = await em.findOne(Moneda, {id:1, usuario:{id:1}});
    const moneda_peso = await em.findOne(Moneda, {id:2, usuario:{id:1}});
    const moneda_euro = await em.findOne(Moneda, {id:3, usuario:{id:1}});
    if (!usuario || !moneda_dolar || !moneda_peso || !moneda_euro) {
      throw new Error('Usuario o moneda no encontrado');
    }
    await em.insertMany(Caja, [
      { nombre: 'Caja Dolares', moneda: moneda_dolar, visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 10000, tipo_moneda: 'USD'},
      { nombre: 'Caja Pesos', moneda: moneda_peso, visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000, tipo_moneda: 'ARS'},
      { nombre: 'Caja Dolares 2', moneda: moneda_dolar, visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 1000, tipo_moneda: 'USD'},
      { nombre: 'Caja Pesos 2', moneda: moneda_peso, visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 3000, tipo_moneda: 'ARS'},
      { nombre: 'Caja Euros', moneda: moneda_euro, visible: true, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000, tipo_moneda: 'EUR'},
    ]);
  }
}