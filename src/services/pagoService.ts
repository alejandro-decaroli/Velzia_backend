import { orm } from '../db/orm.js';
import { Pago } from '../entities/Pago.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllPagos() {
  const pagos = await em.find(Pago, {});
  return pagos;
}

export async function getByIdPago(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, id);
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }
}

export async function createPago(data:any) {
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  const venta = await em.findOne(Venta, data.venta);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda de la venta');
  }
  if (moneda.id !== venta.moneda.id) {
    throw new Conflict('Moneda de la venta no coincide con la moneda de la venta');
  }
  const pago = await em.create(Pago, data);
  await em.flush();
}

export async function updatePago(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, id);
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }
  const moneda = await em.findOne(Moneda, data.moneda);
  const caja = await em.findOne(Caja, data.caja);
  const venta = await em.findOne(Venta, data.venta);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda de la venta');
  }
  if (moneda.id !== venta.moneda.id) {
    throw new Conflict('Moneda de la venta no coincide con la moneda de la venta');
  }
  pago.monto = data.monto;
  pago.caja = caja;
  pago.moneda = moneda;
  pago.venta = venta;
  await em.flush();
}

export async function removePago(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const pago = await em.findOne(Pago, id);
  if (!pago) {
    throw new NotFound('Pago no encontrado');
  }

  await em.removeAndFlush(pago);
}