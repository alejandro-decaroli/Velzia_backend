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
  if (moneda_origen.principal === false) {
    throw new Conflict('Moneda de origen debe ser la moneda principal');
  }
  let codigo: string;
  const tasas = await em.find(Tasa, {usuario: userId});
  const tasaConCodigoMasGrande = tasas.length
  ? tasas.reduce((max, tasa) =>
      Number(tasa.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? tasa : max
    )
  : '1';
  if (tasaConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(tasaConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  await em.create(Tasa, {
    cod: 'TAS_' + codigo,
    moneda_origen: moneda_origen,
    moneda_destino: moneda_destino,
    tasa: data.tasa,
    usuario: userId,
    creadoEn: new Date(),
    actualizadoEn: new Date()
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