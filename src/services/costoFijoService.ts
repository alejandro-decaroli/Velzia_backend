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
  await em.create(CostoFijo, {
    moneda: data.moneda,
    adjudicacion: data.adjudicacion,
    descripcion: data.descripcion,
    monto: data.monto,
    estado: 'Pendiente',
    usuario: userId,
    createdAt: new Date(),
    updatedAt: new Date()
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
  costoFijo.moneda = moneda;
  costoFijo.adjudicacion = data.adjudicacion;
  costoFijo.descripcion = data.descripcion;
  costoFijo.monto = data.monto;
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
  const costosFijos = await em.find(CostoFijo, { createdAt: { $gte: data.createdAt, $lte: data.createdAt } });
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

  if (caja.monto < Number(data.monto)) {
    throw new Conflict('Fondos insuficientes');
  }

  const pago = await em.create(Pago, {
    caja: caja,
    costo_fijo: costoFijo,
    monto: Number(data.monto),
    usuario: usuario,
    createdAt: new Date(),
    updatedAt: new Date()
  });


  
  caja.monto -= Number(data.monto);
  await em.persistAndFlush(caja);
  await em.persistAndFlush(pago);

  const pagos = await em.find(Pago, {costo_fijo: costoFijo});
  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

  if (totalPagado >= costoFijo.monto) {
    costoFijo.estado = 'Pagada';
    await em.persistAndFlush(costoFijo);
  }

}