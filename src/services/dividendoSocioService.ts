import { orm } from '../db/orm.js';
import { Dividendo } from '../entities/Dividendo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllDividendoSocio(userId: number) {
  const dividendoSocio = await em.find(Dividendo, {usuario: userId});
  return dividendoSocio;
}

export async function getByIdDividendoSocio(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  return dividendo;
}

export async function createDividendoSocio(data:any, userId: number) {
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (data.monto > caja.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  };
  caja.monto -= data.monto;
  const dividendo = await em.create(Dividendo, data);
  await em.flush();
}

export async function updateDividendoSocio(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (data.monto > caja.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  caja.monto -= data.monto;
  dividendo.monto = data.monto;
  dividendo.caja = data.caja;
  await em.flush();
}

export async function removeDividendoSocio(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  const cajas = await em.count(Caja, {dividendos: dividendo});
  if (cajas > 0) {
    throw new Conflict('No se puede eliminar el dividendo porque tiene cajas asociadas');
  }

  await em.removeAndFlush(dividendo);
}