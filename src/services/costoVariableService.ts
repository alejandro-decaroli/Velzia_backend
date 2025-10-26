import { orm } from '../db/orm.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostosVariables(userId: number, fecha: string, filtro: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  if (!filtro) {
    const costosVariables = await em.find(CostoVariable, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
    return costosVariables;
  }
  const costosVariables = await em.find(CostoVariable, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }, estado: filtro as any});
  return costosVariables;
}

export async function getByIdCostoVariable(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }

  return costoVariable;
}

export async function createCostoVariable(data:any, userId: number) {
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const cant_costos_variables = await em.count(CostoVariable, {usuario: userId});
  const codigo = String(cant_costos_variables + 1);
  await em.create(CostoVariable, {
    codigo: codigo,
    moneda: moneda,
    adjudicacion: data.adjudicacion,
    monto: data.monto,
    nombre_moneda: moneda.nombre,
    monto_pagado: 0,
    estado: 'Pendiente',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  await em.flush();
}

export async function updateCostoVariable(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const pagos = await em.count(Pago, {costo_variable: costoVariable, usuario: userId});

  if (pagos !== 0) {
    throw new Conflict('El monto no puede ser modificado porque tiene pagos asociados');
  }

  costoVariable.adjudicacion = data.adjudicacion;
  costoVariable.monto = data.monto;
  costoVariable.moneda = moneda;
  costoVariable.nombre_moneda = moneda.nombre;
  costoVariable.actualizadoEn = new Date();
  await em.flush();
}

export async function removeCostoVariable(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }
  const pagos = await em.count(Pago, {costo_variable: costoVariable, usuario: userId});
  if (pagos > 0) {
    throw new Conflict('El costo variable no puede ser eliminado porque tiene pagos asociados');
  }

  await em.removeAndFlush(costoVariable);
}

export async function pagarCostoVariable(data:any, userId:number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costoVariable = await em.findOne(CostoVariable, {id: id, usuario: userId});
  if (!costoVariable) {
    throw new NotFound('Costo Variable no encontrado');
  }
  if (costoVariable.estado === 'Pagada') {
    throw new Conflict('El costo variable ya se encuentra pagado');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (costoVariable.moneda.id !== caja.moneda.id) {
    throw new Conflict('Moneda de la caja no coincide con la moneda del costo variable');
  }

  if (caja.monto < Number(data.monto_pagar)) {
    throw new Conflict('Fondos insuficientes');
  }

  const cant_pagos = await em.count(Pago, {usuario: userId});
  const codigo = String(cant_pagos + 1);

  const pago = await em.create(Pago, {
      caja: caja,
      costo_variable: costoVariable,
      monto: Number(data.monto_pagar),
      codigo: codigo,
      nombre_caja: caja.nombre,
      nombre_cliente: 'No asociado',
      nombre_moneda: costoVariable.nombre_moneda,
      id_costo_fijo: 'No asociado',
      id_costo_variable: String(costoVariable.codigo),
      id_venta: 'No asociado',
      usuario: usuario,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      visible: true
    });
  
  if (costoVariable.monto < Number(pago.monto)) {
    throw new Conflict('El monto del pago excede el monto del costo variable');
  }
  
  caja.monto -= Number(data.monto_pagar);
  costoVariable.monto_pagado += Number(data.monto_pagar);
  await em.persistAndFlush(caja);
  await em.persistAndFlush(pago);

  const pagos = await em.find(Pago, {costo_variable: costoVariable});
  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

  if (totalPagado === Number(costoVariable.monto)) {
    costoVariable.estado = 'Pagada';
    await em.persistAndFlush(costoVariable);
  }
  if (totalPagado > Number(costoVariable.monto)) {
    await em.removeAndFlush(pago);
    throw new Conflict('El monto del último pago excede el monto del costo variable');
  }

}