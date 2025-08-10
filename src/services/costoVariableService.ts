import { orm } from '../db/orm.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostosVariables(userId: number) {
  const costosVariables = await em.find(CostoVariable, {usuario: userId});
  return costosVariables;
}

export async function getByIdCostoVariable(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }

  return costoVariable;
}

export async function createCostoVariable(data:any, userId: number) {
  const venta = await em.findOne(Venta, {id: data.venta, usuario: userId});
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (caja.monto < data.monto_real) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  caja.monto -= Number(data.monto_real);
  const costoVariable = await em.create(CostoVariable, data);
  await em.flush();
}

export async function updateCostoVariable(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const venta = await em.findOne(Venta, {id: data.venta, usuario: userId});
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (caja.monto < data.monto_real) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }
  caja.monto += Number(costoVariable.monto_real);
  caja.monto -= Number(data.monto_real);
  costoVariable.adjudicacion = data.adjudicacion;
  costoVariable.caja = data.caja;
  costoVariable.monto_real = data.monto_real;
  costoVariable.presupuestado = data.presupuestado;
  await em.flush();
}

export async function removeCostoVariable(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }

  await em.removeAndFlush(costoVariable);
}