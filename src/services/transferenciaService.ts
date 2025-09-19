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
  const transferencia = await em.create(Transferencia, data);
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

  const transferencia = await em.findOne(Transferencia, {id: id, usuario: userId});
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }

  transferencia.monto = data.monto;
  transferencia.caja_origen = caja_origen;
  transferencia.caja_destino = caja_destino;
  caja_origen.monto -= data.monto;
  caja_destino.monto += data.monto;
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

  const cajas = await em.count(Caja, {transferencias_origen: transferencia});
  if (cajas > 0) {
    throw new Conflict('No se puede eliminar la transferencia porque tiene cajas de origen asociadas');
  }

  const cajas2 = await em.count(Caja, {transferencias_destino: transferencia});
  if (cajas2 > 0) {
    throw new Conflict('No se puede eliminar la transferencia porque tiene cajas de destino asociadas');
  }

  await em.removeAndFlush(transferencia);
}