import { orm } from '../db/orm.js';
import { Tasa } from '../entities/Tasa.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllTasas() {
  const tasas = await em.find(Tasa, {});
  return tasas;
}

export async function getByIdTasa(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, id);
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }
}

export async function createTasa(data:any) {
  const moneda_origen_id = Number(data.moneda_origen);
  const moneda_destino_id = Number(data.moneda_destino);
  const moneda_origen = await em.findOne(Moneda, moneda_origen_id);
  const moneda_destino = await em.findOne(Moneda, moneda_destino_id);
  if (!moneda_origen || !moneda_destino) {
    throw new NotFound('Moneda de origen o destino no encontrada');
  }
  if (moneda_origen_id === moneda_destino_id) {
    throw new Conflict('Moneda de origen y destino no pueden ser la misma');
  }
  const tasa = await em.create(Tasa, data);
  await em.flush();
}

export async function updateTasa(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, id);
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }
  const moneda_origen_id = Number(data.moneda_origen);
  const moneda_destino_id = Number(data.moneda_destino);
  const moneda_origen = await em.findOne(Moneda, moneda_origen_id);
  const moneda_destino = await em.findOne(Moneda, moneda_destino_id);
  if (!moneda_origen || !moneda_destino) {
    throw new NotFound('Moneda de origen o destino no encontrada');
  }
  if (moneda_origen_id === moneda_destino_id) {
    throw new Conflict('Moneda de origen y destino no pueden ser la misma');
  }
  tasa.tasa = data.tasa;
  tasa.moneda_origen = moneda_origen;
  tasa.moneda_destino = moneda_destino;
  await em.flush();
}

export async function removeTasa(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, id);
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }

  await em.removeAndFlush(tasa);
}