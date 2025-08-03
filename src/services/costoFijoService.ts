import { orm } from '../db/orm.js';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostosFijos(userId: number) {
  const costosFijos = await em.find(CostoFijo, {usuario: userId});
  return costosFijos;
}

export async function getByIdCostoFijo(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }

  return costoFijo;
}

export async function createCostoFijo(data:any, userId: number) {
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (caja.monto < data.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  const costoFijo = await em.create(CostoFijo, data);
  caja.monto -= data.monto;
  await em.flush();
}

export async function updateCostoFijo(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (caja.monto < data.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }
  costoFijo.adjudicacion = data.adjudicacion;
  costoFijo.caja = data.caja;
  costoFijo.monto = data.monto;
  caja.monto -= data.monto;
  await em.flush();
}

export async function removeCostoFijo(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }

  await em.removeAndFlush(costoFijo);
}

export async function getListadoCostosFijosByRangeDate(data:any) {
  const costosFijos = await em.find(CostoFijo, { createdAt: { $gte: data.createdAt, $lte: data.createdAt } });
  return costosFijos;
}
