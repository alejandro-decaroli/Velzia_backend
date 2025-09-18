import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCajas(userId: number) {
  const cajas = await em.find(Caja, {usuario: userId});
  return cajas;
}

export async function getByIdCaja(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  return caja;
}

export async function createCaja(data:any, userId:number) {
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const name = data.nombre;
  const monto = data.monto;
  const nombre_duplicado = await em.findOne(Caja, { nombre: name, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  em.create(Caja, {
    nombre: name,
    monto: monto,
    moneda: moneda,
    usuario: usuario,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await em.flush();
}

export async function updateCaja(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const name = data.nombre;
  const nombre_duplicado = await em.findOne(Caja, { nombre: name, usuario: userId });
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  caja.monto = data.monto;
  caja.nombre = name;
  caja.moneda = moneda;
  await em.flush();
}

export async function removeCaja(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  await em.removeAndFlush(caja);
}