import { orm } from '../db/orm.js';
import { Tasa } from '../entities/Tasa.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllTasas(userId: number) {
  const tasas = await em.find(Tasa, {usuario: userId});
  return tasas;
}

export async function getByIdTasa(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, {id: id, usuario: userId});
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }
}

export async function createTasa(data:any, userId: number) {
  const moneda_origen_id = Number(data.moneda_origen);
  const moneda_destino_id = Number(data.moneda_destino);
  const moneda_origen = await em.findOne(Moneda, {id: moneda_origen_id, usuario: userId});
  const moneda_destino = await em.findOne(Moneda, {id: moneda_destino_id, usuario: userId});
  if (!moneda_origen || !moneda_destino) {
    throw new NotFound('Moneda de origen o destino no encontrada');
  }
  if (moneda_origen_id === moneda_destino_id) {
    throw new Conflict('Moneda de origen y destino no pueden ser la misma');
  }
  const tasa = await em.create(Tasa, data);
  await em.flush();
}

export async function updateTasa(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, {id: id, usuario: userId});
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }
  const moneda_origen_id = Number(data.moneda_origen);
  const moneda_destino_id = Number(data.moneda_destino);
  const moneda_origen = await em.findOne(Moneda, {id: moneda_origen_id, usuario: userId});
  const moneda_destino = await em.findOne(Moneda, {id: moneda_destino_id, usuario: userId});
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

export async function removeTasa(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const tasa = await em.findOne(Tasa, {id: id, usuario: userId});
  if (!tasa) {
    throw new NotFound('Tasa no encontrada');
  }

  const monedas_origen = await em.count(Moneda, {tasas_origen: tasa});
  const monedas_destino = await em.count(Moneda, {tasas_destino: tasa});
  if (monedas_origen > 0 || monedas_destino > 0) {
    throw new Conflict('No se puede eliminar la tasa porque tiene monedas asociadas');
  }

  await em.removeAndFlush(tasa);
}