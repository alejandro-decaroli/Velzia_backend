import { orm } from '../db/orm.js';
import { Transferencia } from '../entities/Transferencia.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllTransferencias(userId: number) {
  const transferencias = await em.find(Transferencia, {usuario: userId});
  return transferencias;
}

export async function getByIdTransferencia(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const transferencia = await em.findOne(Transferencia, {id: id, usuario: userId});
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }
  return transferencia;
}

export async function createTransferencia(data:any, userId: number) {
  const caja_origen = await em.findOne(Caja, {id: data.caja_origen, usuario: userId});
  const caja_destino = await em.findOne(Caja, {id: data.caja_destino, usuario: userId});
  if (!caja_origen) {
    throw new NotFound('Caja de origen no encontrada');
  }
  if (!caja_destino) {
    throw new NotFound('Caja de destino no encontrada');
  }
  if (caja_origen.id === caja_destino.id) {
    throw new BadRequest('Caja de origen y caja de destino no pueden ser iguales');
  }
  if (caja_origen.moneda !== caja_destino.moneda) {
    throw new Conflict('Moneda de la caja de origen no coincide con la moneda de la caja de destino');
  }
  if (data.monto > caja_origen.monto) {
    throw new BadRequest('Monto excede el saldo de la caja de origen');
  }
  await em.create(Transferencia, {
    caja_origen: caja_origen,
    caja_destino: caja_destino,
    monto: data.monto,
    motivo: data.motivo || '',
    usuario: userId,
    nombre_caja_origen: caja_origen.nombre,
    nombre_caja_destino: caja_destino.nombre,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  caja_origen.monto -= data.monto;
  caja_destino.monto += data.monto;
  await em.flush();
}

export async function updateTransferencia(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const caja_origen = await em.findOne(Caja, {id: data.caja_origen, usuario: userId});
  const caja_destino = await em.findOne(Caja, {id: data.caja_destino, usuario: userId});
  const transferencia = await em.findOne(Transferencia, {id: id, usuario: userId});
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }
  const monto_anterior = transferencia.monto;
  const caja_origen_anterior = transferencia.caja_origen;
  const caja_destino_anterior = transferencia.caja_destino;
  if (!caja_origen) {
    throw new NotFound('Caja de origen no encontrada');
  }
  if (!caja_destino) {
    throw new NotFound('Caja de destino no encontrada');
  }

  caja_origen_anterior.monto += monto_anterior;
  caja_destino_anterior.monto -= monto_anterior;
  
  if (caja_origen.id === caja_destino.id) {
    throw new BadRequest('Caja de origen y caja de destino no pueden ser iguales');
  }
  if (caja_origen.moneda !== caja_destino.moneda) {
    throw new Conflict('Moneda de la caja de origen no coincide con la moneda de la caja de destino');
  }
  if (data.monto > caja_origen.monto) {
    throw new BadRequest('Monto excede el saldo de la caja de origen');
  }
  transferencia.monto = data.monto;
  transferencia.caja_origen = caja_origen;
  transferencia.caja_destino = caja_destino;
  transferencia.motivo = data.motivo || '';
  caja_origen.monto -= data.monto;
  caja_destino.monto += data.monto;
  transferencia.actualizadoEn = new Date();
  await em.flush();
}

export async function removeTransferencia(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const transferencia = await em.findOne(Transferencia, {id: id, usuario: userId});
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }

  const caja_origen = await em.findOne(Caja, {transferencias_origen: transferencia});
  const caja_destino = await em.findOne(Caja, {transferencias_destino: transferencia});
  if (!caja_origen || !caja_destino) {
    throw new NotFound('Caja de origen o caja de destino no encontrada');
  }
  caja_origen.monto += transferencia.monto;
  caja_destino.monto -= transferencia.monto;
  await em.flush();
  await em.removeAndFlush(transferencia);
}