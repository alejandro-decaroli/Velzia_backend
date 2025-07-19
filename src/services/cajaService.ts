import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCajas() {
  const cajas = await em.find(Caja, {});
  return cajas;
}

export async function getByIdCaja(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, id);
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  return caja;
}

export async function createCaja(data:any) {
  const moneda = await em.findOne(Moneda, data.moneda);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const name = data.nombre;
  const siglas = data.siglas;
  const nombre_duplicado = await em.findOne(Caja, { nombre: name });
  const siglas_duplicadas = await em.findOne(Caja, { siglas: siglas });
  if (nombre_duplicado) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  if (siglas_duplicadas) {
    throw new Conflict('Las cajas no pueden tener las mismas siglas');
  }
  em.create(Caja, data);
  await em.flush();
}

export async function updateCaja(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, id);
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const moneda = await em.findOne(Moneda, data.moneda);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const name = data.nombre;
  const siglas = data.siglas;
  const nombre_duplicado = await em.findOne(Caja, { nombre: name });
  const siglas_duplicadas = await em.findOne(Caja, { siglas: siglas });
  if (nombre_duplicado) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  if (siglas_duplicadas) {
    throw new Conflict('Las cajas no pueden tener las mismas siglas');
  }
  caja.monto = data.monto;
  caja.nombre = name;
  caja.siglas = siglas;
  caja.moneda = moneda;
  await em.flush();
}

export async function removeCaja(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, id);
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  await em.removeAndFlush(caja);
}