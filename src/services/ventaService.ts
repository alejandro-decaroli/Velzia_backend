import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Cliente } from '../entities/Cliente.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllVentas(userId: number) {
  const ventas = await em.find(Venta, {usuario: userId});
  return ventas;
}

export async function getByIdVenta(userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  return venta;
}

export async function createVenta(data:any, userId: number) {
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  const cliente = await em.findOne(Cliente, {id: data.cliente, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  //if (cliente.getEstado() === 'activo') {
  //  throw new Conflict('Cliente ya tiene una venta activa y no puede tener mas ventas activas simultaneamente');
  //}
  const venta = await em.create(Venta, data);
  await em.flush();
}

export async function updateVenta(data:any, userId: number, id:number) {
  
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const cliente = await em.findOne(Cliente, {id: data.cliente, usuario: userId});
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  //if (cliente.getEstado() === 'activo') {
  //  throw new Conflict('Cliente ya tiene una venta activa y no puede tener mas ventas activas simultaneamente');
  //}
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  venta.cliente = cliente;
  venta.moneda = moneda;
  venta.monto = data.monto;
  venta.estado = data.estado;
  await em.flush();
}

export async function removeVenta(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }

  await em.removeAndFlush(venta);
}

export async function getListadoVentasByDate(data:any) {
  const ventas = await em.find(Venta, { createdAt: { $gte: data.createdAt, $lte: data.createdAt } });
  if (!ventas) {
    throw new NotFound('Ventas no encontradas');
  }
  return ventas;
}