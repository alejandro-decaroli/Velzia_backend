import { orm } from '../db/orm.js';
import { Aporte } from '../entities/Aporte.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;
import { Usuario } from '../entities/Usuario.entities.js';
const em = orm.em;

export async function getAllAportes(userId: number, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const aportes = await em.find(Aporte, {
    usuario: userId,
    creadoEn: { $gte: inicioMes, $lte: finMes }
  });
  return aportes;
}

export async function getByIdAportes(userId: number, id:number) {
  
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const aporteSocio = await em.findOne(Aporte, {id: id, usuario: userId});
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  
  return aporteSocio;
}

export async function createAporte(data:any, userId: number) {
  
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  await em.create(Aporte, {
    monto: data.monto,
    caja: caja,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true,
    nombre_caja: caja.nombre,
  });
  caja.monto += data.monto;
  await em.flush(); 
}

export async function updateAporte(data:any, userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja_id = Number(data.caja)
  const caja = await em.findOne(Caja, {id: caja_id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const aporteSocio = await em.findOne(Aporte, {id: id, usuario: userId});
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  caja.monto -= aporteSocio.monto;
  aporteSocio.monto = data.monto;
  aporteSocio.caja = data.caja;
  caja.monto += data.monto;
  aporteSocio.actualizadoEn = new Date();
  await em.flush();
}

export async function removeAporte(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const aporteSocio = await em.findOne(Aporte, {id: id, usuario: userId});
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  const caja = await em.findOne(Caja, {id: aporteSocio.caja.id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  caja.monto -= aporteSocio.monto;
  await em.flush();
  await em.removeAndFlush(aporteSocio);
}