import { orm } from '../db/orm.js';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;
import { Moneda } from '../entities/Moneda.entities.js';

const em = orm.em;

export async function getAllCostosFijos(userId: number) {
  const costosFijos = await em.find(CostoFijo, {usuario: userId});
  return costosFijos;
}

export async function getByIdCostoFijo(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }

  return costoFijo;
}

export async function createCostoFijo(data:any, userId: number) {
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  await em.create(CostoFijo, {
    moneda: moneda,
    adjudicacion: data.adjudicacion,
    nombre_moneda: moneda.nombre,
    monto: data.monto,
    monto_pagado: 0,
    estado: 'Pendiente',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  await em.flush();
}

export async function updateCostoFijo(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const pagos = await em.count(Pago, {costo_fijo: costoFijo, usuario: userId});
  if (pagos !== 0) {
    throw new Conflict('El costo fijo ya tiene pagos asociados, no se puede modificar');
  }
  costoFijo.moneda = moneda;
  costoFijo.nombre_moneda = moneda.nombre;
  costoFijo.adjudicacion = data.adjudicacion;
  if (costoFijo.monto !== data.monto && pagos !== 0) {
    throw new Conflict('El monto no puede ser modificado porque tiene pagos asociados');
  }
  costoFijo.monto = data.monto;
  costoFijo.actualizadoEn = new Date();
  await em.flush();
}

export async function removeCostoFijo(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }
  const pagos = await em.count(Pago, {costo_fijo: costoFijo, usuario: userId});
  if (pagos > 0) {
    throw new Conflict('El costo fijo no puede ser eliminado porque tiene pagos asociados');
  }
  await em.removeAndFlush(costoFijo);
}

export async function getListadoCostosFijosByRangeDate(data:any) {
  const costosFijos = await em.find(CostoFijo, { creadoEn: { $gte: data.createdAt, $lte: data.createdAt } });
  return costosFijos;
}

export async function pagarCostoFijo(data:any, userId:number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoFijo = await em.findOne(CostoFijo, {id: id, usuario: userId});
  if (!costoFijo) {
    throw new NotFound('Costo fijo no encontrado');
  }
  if (costoFijo.estado === 'Pagada') {
    throw new Conflict('El costo fijo ya se encuentra pagado');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (costoFijo.moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del costo fijo');
  }

  if (caja.monto < Number(data.monto_pagar)) {
    throw new Conflict('Fondos insuficientes');
  }

  const pago = await em.create(Pago, {
    caja: caja,
    costo_fijo: costoFijo,
    monto: Number(data.monto_pagar),
    nombre_caja: caja.nombre,
    nombre_cliente: 'No asociado',
    nombre_moneda: costoFijo.nombre_moneda,
    id_costo_fijo: costoFijo.id.toString(),
    id_costo_variable: 'No asociado',
    id_venta: 'No asociado',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  
  if (costoFijo.monto < Number(pago.monto)) {
    throw new Conflict('El monto del pago excede el monto del costo fijo');
  }
  
  costoFijo.monto_pagado += Number(data.monto_pagar);
  caja.monto -= Number(data.monto_pagar);
  await em.persistAndFlush(caja);
  await em.persistAndFlush(pago);
  
  const pagos = await em.find(Pago, {costo_fijo: costoFijo});
  const totalPagado = pagos.reduce((monto, pago) => Number(monto) + Number(pago.monto), 0);
  if (totalPagado === Number(costoFijo.monto)) {
    costoFijo.estado = 'Pagada';
    await em.persistAndFlush(costoFijo);
  } 
  if (totalPagado > Number(costoFijo.monto)) {
    
    await em.removeAndFlush(pago);
    throw new Conflict('El monto del último pago excede el monto del costo fijo');
  }

}