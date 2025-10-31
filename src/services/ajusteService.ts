import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllAjustes(userId: number, filtro: string, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);

  if (filtro) {
    const ajustes = await em.find(Ajuste, {
      usuario: userId,
      creadoEn: { $gte: inicioMes, $lte: finMes },
      movimiento: filtro as any
    });
    return ajustes;
  } else {
    const ajustes = await em.find(Ajuste, {
      usuario: userId,
      creadoEn: { $gte: inicioMes, $lte: finMes }
    });
    return ajustes;
  }
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
  const cant_ajustes = await em.find(Ajuste, {usuario: userId});
  const ultimo_ajuste = cant_ajustes[cant_ajustes.length - 1];
  let codigo = '';
  if (!ultimo_ajuste) {
    codigo = '1';
  } else {
    codigo = String(Number(ultimo_ajuste.codigo) + 1);
  }
  const ajuste = await em.create(Ajuste, {
    caja: caja,
    codigo: codigo,
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