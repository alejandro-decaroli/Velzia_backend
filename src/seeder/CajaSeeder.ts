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
    const cajas = await em.find(Caja, {});
    if (cajas.length > 0) {
      return;
    }
    await em.insertMany(Caja, [
      { cod: 'CA_1', nombre: 'Caja Dolares', moneda: moneda_dolar, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 10000},
      { cod: 'CA_2', nombre: 'Caja Pesos', moneda: moneda_peso, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000},
      { cod: 'CA_3', nombre: 'Caja Dolares 2', moneda: moneda_dolar, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 1000},
      { cod: 'CA_4', nombre: 'Caja Pesos 2', moneda: moneda_peso, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 3000},
      { cod: 'CA_5', nombre: 'Caja Euros', moneda: moneda_euro, creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000},
    ]);
  }
}