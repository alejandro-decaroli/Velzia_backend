import { orm } from '../db/orm.js';
import { Dividendo } from '../entities/Dividendo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllDividendoSocio() {
  const dividendoSocio = await em.find(Dividendo, {});
  return dividendoSocio;
}

export async function getByIdDividendoSocio(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const dividendo = await em.findOne(Dividendo, id);
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  return dividendo;
}

export async function createDividendoSocio(data:any) {
  const caja = await em.findOne(Caja, data.caja);
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

export async function updateDividendoSocio(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const dividendo = await em.findOne(Dividendo, id);
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }
  const caja = await em.findOne(Caja, data.caja);
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

export async function removeDividendoSocio(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const dividendo = await em.findOne(Dividendo, id);
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  await em.removeAndFlush(dividendo);
}