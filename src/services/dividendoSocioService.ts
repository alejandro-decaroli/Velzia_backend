import { orm } from '../db/orm.js';
import { Dividendo } from '../entities/Dividendo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
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
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del dividendo');
  }
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
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del dividendo');
  }
  dividendo.monto = data.monto;
  dividendo.moneda = data.moneda;
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