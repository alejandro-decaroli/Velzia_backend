import { orm } from '../db/orm.js';
import { Pago } from '../entities/Pago.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllPagos(userId: number) {
  const pagos = await em.find(Pago, {usuario: userId});
  return pagos;
}

export async function getByIdPago(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, {id: id, usuario: userId});
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }
}

export async function createPago(data:any, userId: number) {
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  const venta = await em.findOne(Venta, {id: data.venta, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (venta.moneda !== caja.moneda) {
    throw new Conflict('Moneda de la caja no coincide con la moneda de la venta');
  }
  caja.monto += data.monto;
  const pago = await em.create(Pago, data);
  await em.flush();
}

export async function updatePago(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, {id: id, usuario: userId});
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  const venta = await em.findOne(Venta, {id: data.venta, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (venta.moneda !== caja.moneda) {
    throw new Conflict('Moneda de la caja no coincide con la moneda de la venta');
  }
  caja.monto += data.monto;
  pago.monto = data.monto;
  pago.caja = caja;
  pago.venta = venta;
  await em.flush();
}

export async function removePago(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, {id: id, usuario: userId});
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }

  await em.removeAndFlush(pago);
}