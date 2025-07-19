import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
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
  const caja_id = Number(data.caja);
  const caja = await em.findOne(Caja, caja_id);
  const movimiento = data.movimiento;
  if (!caja) {
    throw new NotFound('Caja no encontrada'); 
  }
  if (movimiento === 'ingreso') {
    caja.monto += data.monto;
  } else if (movimiento === 'egreso') {
    caja.monto -= data.monto;
    if (caja.monto < 0) {
      throw new BadRequest('El monto de la caja es negativo');
    }
  }
  const ajuste = await em.create(Ajuste, data);
  await em.flush();
}

export async function updateAjuste(data:any, id:number) {
  const ajuste = await getByIdAjuste(data, id);
  const caja_id = Number(data.caja);
  const caja = await em.findOne(Caja, caja_id);
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  ajuste.monto = data.monto;
  ajuste.movimiento = data.movimiento;
  ajuste.caja = data.caja;
  if (ajuste.movimiento === 'ingreso') {
    caja.monto += data.monto;
  } else if (ajuste.movimiento === 'egreso') {
    caja.monto -= data.monto;
    if (caja.monto < 0) {
      throw new BadRequest('El monto de la caja es negativo');
    }
  }
  await em.flush();
}

export async function removeAjuste(data:any, id:number){
  const ajuste = await getByIdAjuste(data, id);
  await em.removeAndFlush(ajuste);
}