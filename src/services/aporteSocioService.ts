import { orm } from '../db/orm.js';
import { Aporte } from '../entities/Aporte.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllAportes() {
  const aportes = await em.find(Aporte, {});
  return aportes;
}

export async function getByIdAportes(data:any, id:number) {
  
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const aporteSocio = await em.findOne(Aporte, id);
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  
  return aporteSocio;
}

export async function createAporte(data:any) {
  const caja = await em.findOne(Caja, Number(data.caja));
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const aporteSocio = await em.create(Aporte, data);
  caja.monto += data.monto;
  await em.flush(); 
}

export async function updateAporte(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, data.caja);
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const aporteSocio = await em.findOne(Aporte, id);
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  aporteSocio.monto = data.monto;
  aporteSocio.caja = data.caja;
  caja.monto += data.monto;
  await em.flush();
}

export async function removeAporte(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const aporteSocio = await em.findOne(Aporte, id);
  if (!aporteSocio) {
    throw new NotFound('Aporte socio no encontrado');
  }
  await em.removeAndFlush(aporteSocio);
}