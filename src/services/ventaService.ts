import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Cliente } from '../entities/Cliente.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllVentas() {
  const ventas = await em.find(Venta, {});
  return ventas;
}

export async function getByIdVenta(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const venta = await em.findOne(Venta, id);
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  return venta;
}

export async function createVenta(data:any) {
  const moneda = await em.findOne(Moneda, data.moneda);
  const cliente = await em.findOne(Cliente, data.cliente);
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

export async function updateVenta(data:any, id:number) {
  
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const cliente = await em.findOne(Cliente, data.cliente);
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  //if (cliente.getEstado() === 'activo') {
  //  throw new Conflict('Cliente ya tiene una venta activa y no puede tener mas ventas activas simultaneamente');
  //}
  const moneda = await em.findOne(Moneda, data.moneda);
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const venta = await em.findOne(Venta, id);
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  venta.cliente = cliente;
  venta.moneda = moneda;
  venta.monto = data.monto;
  venta.costo_mano_obra = data.costo_mano_obra;
  venta.costo_materiales_viaticos_fletes = data.costo_materiales_viaticos_fletes;
  venta.costo_comision = data.costo_comision;
  venta.estado = data.estado;
  await em.flush();
}

export async function removeVenta(data:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const venta = await em.findOne(Venta, id);
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }

  await em.removeAndFlush(venta);
}