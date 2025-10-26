import { orm } from '../db/orm.js';
import { Tasa } from '../entities/Tasa.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllTasas(userId: number, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const tasas = await em.find(Tasa, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
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
  return tasa;
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
  const cant_tasas = await em.count(Tasa, {usuario: userId});
  const codigo = String(cant_tasas + 1);
  await em.create(Tasa, {
    codigo: codigo,
    moneda_origen: moneda_origen,
    moneda_destino: moneda_destino,
    tasa: data.tasa,
    usuario: userId,
    nombre_moneda_origen: moneda_origen.nombre,
    nombre_moneda_destino: moneda_destino.nombre,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
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
  tasa.nombre_moneda_origen = moneda_origen.nombre;
  tasa.nombre_moneda_destino = moneda_destino.nombre;
  tasa.actualizadoEn = new Date();
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

  await em.removeAndFlush(tasa);
}