import { orm } from '../db/orm.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostosVariables(userId: number) {
  const costosVariables = await em.find(CostoVariable, {usuario: userId});
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
  await em.create(CostoVariable, {
    moneda: moneda,
    adjudicacion: data.adjudicacion,
    monto: data.monto,
    descripcion: data.descripcion,
    estado: 'Pendiente',
    usuario: usuario,
    createdAt: new Date(),
    updatedAt: new Date()
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
  costoVariable.adjudicacion = data.adjudicacion;
  costoVariable.monto = data.monto;
  costoVariable.estado = data.estado;
  costoVariable.descripcion = data.descripcion;
  costoVariable.moneda = moneda;
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

  if (caja.monto < Number(data.monto)) {
    throw new Conflict('Fondos insuficientes');
  }

  const pago = await em.create(Pago, {
    caja: caja,
    costo_variable: costoVariable,
    monto: Number(data.monto),
    usuario: usuario,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  caja.monto -= Number(data.monto);
  await em.persistAndFlush(caja);
  await em.persistAndFlush(pago);

  const pagos = await em.find(Pago, {costo_variable: costoVariable});
  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

  if (totalPagado >= costoVariable.monto) {
    costoVariable.estado = 'Pagada';
    await em.persistAndFlush(costoVariable);
  }

}