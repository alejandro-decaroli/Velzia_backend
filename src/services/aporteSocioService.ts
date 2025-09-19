import { orm } from '../db/orm.js';
import { Aporte } from '../entities/Aporte.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;
import { Usuario } from '../entities/Usuario.entities.js';
const em = orm.em;

export async function getAllAportes(userId: number) {
  const aportes = await em.find(Aporte, {usuario: userId});
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
  const caja_id = Number(data.caja)
  const caja = await em.findOne(Caja, {id: caja_id, usuario: userId});
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
    createdAt: new Date(),
    updatedAt: new Date()
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
  const cajas = await em.count(Caja, {aportes: aporteSocio, usuario: userId});
  if (cajas > 0) {
    throw new Conflict('El aporte no puede ser eliminado porque tiene cajas asociadas');
  }
  await em.removeAndFlush(aporteSocio);
}