import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCajas(userId: number, fecha: string) {
  if (!fecha) {
    return await em.find(Caja, {usuario: userId});
  }

  const fechaDate = new Date(fecha.split('T')[0]);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const cajas = await em.find(Caja, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
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
  let codigo: string;
  const cajas = await em.find(Caja, {usuario: userId});
  const cajaConCodigoMasGrande = cajas.length
  ? cajas.reduce((max, caja) =>
      Number(caja.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? caja : max
    )
  : '1';
  if (cajaConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(cajaConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  await em.create(Caja, {
    cod: 'CA_' + codigo,
    nombre: name,
    monto: monto,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
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
  const monto_anterior = caja.monto;
  const nombre_duplicado = await em.findOne(Caja, { nombre: data.nombre, usuario: userId });
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  caja.nombre = data.nombre;
  caja.monto = data.monto;
  caja.actualizadoEn = new Date();
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