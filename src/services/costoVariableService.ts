import { orm } from '../db/orm.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostosVariables() {
  const costosVariables = await em.find(CostoVariable, {});
  return costosVariables;
}

export async function getByIdCostoVariable(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costoVariable = await em.findOne(CostoVariable, id);
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }

  return costoVariable;
}

export async function createCostoVariable(data:any) {
  const venta = await em.findOne(Venta, data.venta);
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== venta.moneda.id) {
    throw new Conflict('Moneda de la venta no coincide con la moneda del costo variable');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del costo Variable');
  }
  const costoVariable = await em.create(CostoVariable, data);
  await em.flush();
}

export async function updateCostoVariable(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const venta = await em.findOne(Venta, data.venta);
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== venta.moneda.id) {
    throw new Conflict('Moneda de la venta no coincide con la moneda del costo variable');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del costo Variable');
  }

  const costoVariable = await em.findOne(CostoVariable, id);
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }
  costoVariable.adjudicacion = data.adjudicacion;
  costoVariable.caja = data.caja;
  costoVariable.monto = data.monto;
  costoVariable.moneda = data.moneda;
  await em.flush();
}

export async function removeCostoVariable(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoVariable = await em.findOne(CostoVariable, id);
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }

  await em.removeAndFlush(costoVariable);
}