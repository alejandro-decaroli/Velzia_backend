import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllAjustes() {
  const ajustes = await em.find(Ajuste, {});
  return ajustes;
}

export async function getByIdAjuste(data:any, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }

  const ajuste = await em.findOne(Ajuste, id);
  if (!ajuste) {
    throw new NotFound('Ajuste no encontrado');
  }

  return ajuste;
}

export async function createAjuste(data:any) {
  const moneda_id = Number(data.moneda);
  const caja_id = Number(data.caja);
  const moneda = await em.findOne(Moneda, moneda_id);
  const caja = await em.findOne(Caja, caja_id);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada'); 
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del ajuste');
  }
  const ajuste = await em.create(Ajuste, data);
  await em.flush();
}

export async function updateAjuste(data:any, id:number) {
  const ajuste = await getByIdAjuste(data, id);
  const moneda_id = Number(data.moneda);
  const caja_id = Number(data.caja);
  const moneda = await em.findOne(Moneda, moneda_id);
  const caja = await em.findOne(Caja, caja_id);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada'); 
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del ajuste');
  }
  ajuste.monto = data.monto;
  ajuste.movimiento = data.movimiento;
  ajuste.moneda = data.moneda;
  ajuste.caja = data.caja;
  await em.flush();
}

export async function removeAjuste(data:any, id:number){
  const ajuste = await getByIdAjuste(data, id);
  await em.removeAndFlush(ajuste);
}