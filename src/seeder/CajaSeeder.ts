import { Seeder } from '@mikro-orm/seeder';
import { Caja } from '../entities/Caja.entities.js';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario.entities.js';

export class CajaSeeder extends Seeder {
  async run(em: EntityManager) {
    const usuario = await em.findOne(Usuario, {id:1});
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const cajas = await em.find(Caja, {});
    if (cajas.length > 0) {
      return;
    }
    await em.insertMany(Caja, [
      { cod: 'CA_1', nombre: 'Caja Principal', creadoEn: new Date(2026, 5, 22), actualizadoEn: new Date(), usuario: usuario, monto: 10000},
      { cod: 'CA_2', nombre: 'Caja Secundaria', creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000},
      { cod: 'CA_3', nombre: 'Caja Chica', creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 1000},
      { cod: 'CA_4', nombre: 'Caja Banco', creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 3000},
      { cod: 'CA_5', nombre: 'Caja Reserva', creadoEn: new Date(), actualizadoEn: new Date(), usuario: usuario, monto: 5000},
    ]);
  }
}