import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Aporte } from '../entities/Aporte.entities.js';
import { Dividendo } from '../entities/Dividendo.entities.js';
import { Transferencia } from '../entities/Transferencia.entities.js';
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
  await em.create(Caja, {
    nombre: name,
    monto: monto,
    moneda: moneda,
    tipo_moneda: moneda.codigo_iso,
    usuario: usuario,
    visible: true,
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
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const monto_anterior = caja.monto;
  const nombre_duplicado = await em.findOne(Caja, { nombre: data.nombre, usuario: userId });
  const ajustes = await em.count(Ajuste, {caja: caja});
  const pagos = await em.count(Pago, {caja: caja});
  const aportes = await em.count(Aporte, {caja: caja});
  const dividendos = await em.count(Dividendo, {caja: caja});
  const transferencias_origen = await em.count(Transferencia, {caja_origen: caja});
  const transferencias_destino = await em.count(Transferencia, {caja_destino: caja});
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  caja.nombre = data.nombre;
  if (caja.moneda.id !== moneda.id || monto_anterior !== data.monto) {

    if (ajustes > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene ajustes asociados');
    }
    if (pagos > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene pagos asociados');
    }
    if (aportes > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene aportes asociados');
    }
    if (dividendos > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene dividendos asociados');
    }
    if (transferencias_origen > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene transferencias de origen asociadas');
    }
    if (transferencias_destino > 0) {
      throw new Conflict('No se puede cambiar la moneda ni el monto porque tiene transferencias de destino asociadas');
    }
  }
  caja.moneda = moneda;
  caja.tipo_moneda = moneda.codigo_iso;
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

  const ajustes = await em.count(Ajuste, {caja: caja});
  const pagos = await em.count(Pago, {caja: caja});
  const aportes = await em.count(Aporte, {caja: caja});
  const dividendos = await em.count(Dividendo, {caja: caja});
  const transferencias_origen = await em.count(Transferencia, {caja_origen: caja});
  const transferencias_destino = await em.count(Transferencia, {caja_destino: caja});

  if (ajustes > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene ajustes asociados');
  }
  if (pagos > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene pagos asociados');
  }
  if (aportes > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene aportes asociados');
  }
  if (dividendos > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene dividendos asociados');
  }
  if (transferencias_origen > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene transferencias de origen asociadas');
  }
  if (transferencias_destino > 0) {
    throw new Conflict('La caja no puede ser eliminada porque tiene transferencias de destino asociadas');
  }

  await em.removeAndFlush(caja);
}