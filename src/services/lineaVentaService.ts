import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { LineaVenta } from '../entities/LineaVenta.entities.js';
import { Producto } from '../entities/Producto.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function registrarDetalle(data:any, userId: number, ventaId: number) {
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const producto = await em.findOne(Producto, {id: data.producto, usuario: userId});
  if (!producto) {
    throw new NotFound('Producto no encontrado');
  }
  const venta = await em.findOne(Venta, {id: ventaId, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos', 'Cancelada'].includes(venta.estado)) {
    throw new Conflict('No se puede agregar líneas a una venta que ya está pagada o cancelada');
  }

  if (producto.stock < Number(data.cantidad)) {
    throw new Conflict('Stock insuficiente');
  }

  let codigo: string;
  const cant_detalles = await em.find(LineaVenta, {usuario: userId});
  const detalleConCodigoMasGrande = cant_detalles.length
  ? cant_detalles.reduce((max, detalle) =>
      Number(detalle.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? detalle : max
    )
  : '1';
  if (detalleConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(detalleConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  const detalle = em.create(LineaVenta, {
    venta: venta,
    producto: producto,
    cod: 'DE_' + codigo,
    cantidad: Number(data.cantidad),
    precio_unitario: Number(data.precio_unitario),
    descuento: Number(data.descuento),
    subtotal: Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100)),
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });

  producto.stock -= Number(data.cantidad);
  venta.total += Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));

  await em.persistAndFlush(detalle);
  await em.persistAndFlush(producto);
  await em.persistAndFlush(venta);
}

export async function DetalleVenta(userId: number, ventaId: number) {
  const venta = await em.findOne(Venta, {id: ventaId, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  const detalles = await em.find(LineaVenta, {venta: venta});
  return detalles;
}

export async function DetalleVentaById(userId: number, detalleId: number) {
  const detalle = await em.findOne(LineaVenta, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  return detalle;
}


export async function delete_Detalle_Venta(userId: number, detalleId: number) {
  const detalle = await em.findOne(LineaVenta, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  const venta = await em.findOne(Venta, {id: detalle.venta.id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos', 'Cancelada'].includes(venta.estado)) {
    throw new Conflict('No se puede eliminar líneas de una venta que ya está pagada o cancelada');
  }
  venta.total -= detalle.subtotal;
  await em.removeAndFlush(detalle);
  await em.persistAndFlush(venta);
}

export function detallesByUser(userId: number) {
  const detalles = em.find(LineaVenta, {usuario: userId});
  return detalles;
}

export async function update_Detalle_Venta(data:any, userId: number, detalleId: number) {
  const detalle = await em.findOne(LineaVenta, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  const venta = await em.findOne(Venta, {id: detalle.venta.id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos', 'Cancelada'].includes(venta.estado)) {
    throw new Conflict('No se puede editar líneas de una venta que ya está pagada o cancelada');
  }
  const nuevoSubtotal = Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));
  venta.total = Number(venta.total) - Number(detalle.subtotal) + nuevoSubtotal;
  detalle.cantidad = Number(data.cantidad);
  detalle.precio_unitario = Number(data.precio_unitario);
  detalle.descuento = Number(data.descuento);
  detalle.subtotal = nuevoSubtotal;
  detalle.actualizadoEn = new Date();
  await em.persistAndFlush(detalle);
  await em.persistAndFlush(venta);
}