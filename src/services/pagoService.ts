import { orm } from '../db/orm.js';
import { Pago } from '../entities/Pago.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import createError from 'http-errors';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllPagos(userId: number, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const pagos = await em.find(Pago, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
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
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
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
  let codigo: string;
  const pagos = await em.find(Pago, {usuario: userId});
  const pagoConCodigoMasGrande = pagos.length
  ? pagos.reduce((max, pago) =>
      Number(pago.cod) > Number(max.cod) ? pago : max
    )
  : '1';
  if (pagoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(pagoConCodigoMasGrande.cod) + 1);
  }
  await em.create(Pago, {
    cod: 'PA_' + codigo,
    caja: caja,
    monto: data.monto,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
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
  pago.actualizadoEn = new Date();
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
  const caja = await em.findOne(Caja, {pagos: pago});
  const costos_fijos = await em.findOne(CostoFijo, {pagos: pago});
  const costos_variables = await em.findOne(CostoVariable, {pagos: pago});
  const ventas = await em.findOne(Venta, {pagos: pago});

  if (ventas instanceof Venta) {
    caja!.monto -= pago.monto;
    ventas.total_pagado -= pago.monto;
    ventas.estado = 'Pendiente';
    await em.flush();
  } else if (costos_fijos instanceof CostoFijo) {
    caja!.monto += pago.monto;
    costos_fijos.monto_pagado -= pago.monto;
    costos_fijos.estado = 'Pendiente';
    await em.flush();
  } else if (costos_variables instanceof CostoVariable) {
    caja!.monto += pago.monto;
    costos_variables.monto_pagado -= pago.monto;
    costos_variables.estado = 'Pendiente';
    await em.flush();
  }
  await em.removeAndFlush(pago);
}