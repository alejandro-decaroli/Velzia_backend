import { orm } from '../db/orm.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllMoneda() {
  const monedas = await em.find(Moneda, {});
  return monedas;
}

export async function getByIdMoneda(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido' );
  }

  const moneda = await em.findOne(Moneda, id);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
}

export async function createMoneda(data:any) {
  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre });
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso });
  if (nombre_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  if (codigo_iso_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
  const moneda = await em.create(Moneda, data);
  await em.flush();
}

export async function updateMoneda(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const moneda = await em.findOne(Moneda, id);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre });
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso });
  if (nombre_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  if (codigo_iso_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
  moneda.nombre = data.nombre;
  moneda.codigo_iso = data.codigo_iso;
  await em.flush();
}

export async function removeMoneda(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const moneda = await em.findOne(Moneda, id);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }

  await em.removeAndFlush(moneda);
}