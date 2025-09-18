import { orm } from '../db/orm.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllMoneda(userId: number) {
  const monedas = await em.find(Moneda, {usuario: userId});
  return monedas;
}

export async function getByIdMoneda(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido' );
  }

  const moneda = await em.findOne(Moneda, {id:id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  return moneda;
}

export async function createMoneda(data:any, userId: number) {
  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre, usuario: userId });
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  if (codigo_iso_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  await em.create(Moneda, {
    nombre: data.nombre,
    codigo_iso: data.codigo_iso,
    usuario: usuario,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await em.flush();
}

export async function updateMoneda(data:any, userId: number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const moneda = await em.findOne(Moneda, {id: id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }

  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre, usuario: userId });
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso, usuario: userId });
  if (codigo_iso_duplicado && codigo_iso_duplicado.id !== id) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
 
  moneda.nombre = data.nombre;
  moneda.codigo_iso = data.codigo_iso;
  await em.flush();
}

export async function removeMoneda(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const moneda = await em.findOne(Moneda, {id: id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }

  await em.removeAndFlush(moneda);
}