import { orm } from '../db/orm.js';
import { Transferencia } from '../entities/Transferencia.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllTransferencias() {
  const transferencias = await em.find(Transferencia, {});
  return transferencias;
}

export async function getByIdTransferencia(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const transferencia = await em.findOne(Transferencia, id);
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }
}

export async function createTransferencia(data:any) {
  const caja_origen = await em.findOne(Caja, data.caja_origen);
  const caja_destino = await em.findOne(Caja, data.caja_destino);
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
  const transferencia = await em.create(Transferencia, data);
  await em.flush();
}

export async function updateTransferencia(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const caja_origen = await em.findOne(Caja, data.caja_origen);
  const caja_destino = await em.findOne(Caja, data.caja_destino);
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
  const transferencia = await em.findOne(Transferencia, id);
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }

  transferencia.monto = data.monto;
  transferencia.caja_origen = caja_origen;
  transferencia.caja_destino = caja_destino;
  await em.flush();
}

export async function removeTransferencia(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const transferencia = await em.findOne(Transferencia, id);
  if (!transferencia) {
    throw new NotFound('Transferencia no encontrada');
  }

  await em.removeAndFlush(transferencia);
}