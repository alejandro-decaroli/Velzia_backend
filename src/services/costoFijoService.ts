import { orm } from '../db/orm.js';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;
import { Moneda } from '../entities/Moneda.entities.js';

const em = orm.em;

export async function getAllCostosFijos(userId: number, fecha: string, filtro: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  if (!filtro) {
    const costosFijos = await em.find(CostoFijo, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
    return costosFijos;
  }
  const costosFijos = await em.find(CostoFijo, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }, estado: filtro as any});
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
  let codigo: string;
  const costosFijos = await em.find(CostoFijo, {usuario: userId});
  const costoFijoConCodigoMasGrande = costosFijos.length
  ? costosFijos.reduce((max, costoFijo) =>
      Number(costoFijo.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? costoFijo : max
    )
  : '1';
  if (costoFijoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(costoFijoConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  await em.create(CostoFijo, {
    cod: 'CF_' + codigo,
    moneda: moneda,
    categoria: data.categoria,
    adjudicacion: data.adjudicacion,
    monto: data.monto,
    monto_pagado: 0,
    estado: 'Pendiente',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
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
  costoFijo.categoria = data.categoria;
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

  let codigo: string;
  const array_pagos = await em.find(Pago, {usuario: userId});
  const pagoConCodigoMasGrande = array_pagos.length
  ? array_pagos.reduce((max, pago) =>
      Number(pago.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? pago : max
    )
  : '1';
  if (pagoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(pagoConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }

  const pago = await em.create(Pago, {
    caja: caja,
    costo_fijo: costoFijo,
    cod: 'PA_' + codigo,
    monto: Number(data.monto_pagar),
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
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