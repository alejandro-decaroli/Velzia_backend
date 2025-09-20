import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllAjustes(userId: number) {
  const ajustes = await em.find(Ajuste, {usuario: userId});
  return ajustes;
}

export async function getByIdAjuste(userId: number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }

  const ajuste = await em.findOne(Ajuste, {id: id, usuario: userId});
  if (!ajuste) {
    throw new NotFound('Ajuste no encontrado');
  }

  return ajuste;
}

export async function createAjuste(data: any, userId: number) {
  const caja_id = Number(data.caja);
  const caja = await em.findOne(Caja, {id: caja_id, usuario: userId});
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
  const ajuste = await em.create(Ajuste, {
    caja: caja,
    monto: data.monto,
    movimiento: data.movimiento,
    usuario: userId,
    visible: true,
    nombre_caja: caja.nombre,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
  await em.flush();
}

export async function updateAjuste(data:any, userId: number, id:number) {
  const ajuste = await getByIdAjuste(userId, id);
  const caja_id = Number(data.caja);
  const caja = await em.findOne(Caja, {id: caja_id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const caja_anterior = await em.findOne(Caja, {id: ajuste.caja.id, usuario: userId});
  if (!caja_anterior) {
    throw new NotFound('Caja anterior no encontrada');
  }
  const monto_anterior = ajuste.monto;
  const movimiento_anterior = ajuste.movimiento;
  ajuste.monto = data.monto;
  ajuste.movimiento = data.movimiento;
  ajuste.caja = data.caja;
  if (movimiento_anterior === 'ingreso') {
    caja_anterior.monto -= monto_anterior;
    if (caja_anterior.monto < 0) {
      throw new BadRequest('El monto de la caja es negativo');
    }
  } else if (movimiento_anterior === 'egreso') {
    caja_anterior.monto += monto_anterior;

  }
  if (data.movimiento === 'ingreso') {
    caja.monto += data.monto;
  } else if (data.movimiento === 'egreso') {
    caja.monto -= data.monto;
    if (caja.monto < 0) {
      throw new BadRequest('El monto de la caja es negativo');
    }
  }
  ajuste.nombre_caja = caja.nombre;
  ajuste.actualizadoEn = new Date();
  await em.flush();
}

export async function removeAjuste(userId: number, id:number){
  const ajuste = await getByIdAjuste(userId, id);
  if (!ajuste) {
    throw new NotFound('Ajuste no encontrado');
  }

  const caja = await em.findOne(Caja, {id: ajuste.caja.id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (ajuste.movimiento === 'ingreso') {
    caja.monto -= ajuste.monto;
  } else if (ajuste.movimiento === 'egreso') {
    caja.monto += ajuste.monto;
    if (caja.monto < 0) {
      throw new BadRequest('El monto de la caja es negativo');
    }
  }
  await em.flush();
  await em.removeAndFlush(ajuste);
}