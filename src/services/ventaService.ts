import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Cliente } from '../entities/Cliente.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { Detalle } from '../entities/Detalle.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Pago } from '../entities/Pago.entities.js';
import { Caja } from '../entities/Caja.entities.js';
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
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }

  const venta = em.create(Venta, {
    cliente,
    moneda,
    total: 0,
    total_pagado: 0,
    estado: 'Pendiente',
    usuario,
    nombre_cliente: cliente.nombre,
    apellido_cliente: cliente.apellido,
    moneda_asociada: moneda.nombre,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
});

await em.persistAndFlush(venta);
}

export async function updateVenta(data:any, userId: number, id:number) {
  
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const cliente = await em.findOne(Cliente, {id: data.cliente, usuario: userId});
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  const moneda = await em.findOne(Moneda, {id: data.moneda, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  const pagos = await em.count(Pago, {venta: venta});
  if (pagos !== 0) {
    throw new Conflict('No se puede modificar la venta porque tiene pagos asociados');
  }
  venta.total = data.total;
  venta.cliente = cliente;
  venta.nombre_cliente = cliente.nombre;
  venta.apellido_cliente = cliente.apellido;
  venta.moneda = moneda;
  venta.actualizadoEn = new Date();
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

  const pagos = await em.count(Pago, {venta: venta});
  if (pagos > 0) {
    throw new Conflict('No se puede eliminar la venta porque tiene pagos asociados');
  }

  const detalles = await em.find(Detalle, {venta: venta});
  detalles.forEach(detalle => {
    em.remove(detalle);
  });

  await em.flush();
  await em.removeAndFlush(venta);
}

export async function getListadoVentasByDate(data:any) {
  const ventas = await em.find(Venta, { creadoEn: { $gte: data.createdAt, $lte: data.createdAt } });
  if (!ventas) {
    throw new NotFound('Ventas no encontradas');
  }
  return ventas;
}

export async function cancelarVenta(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }

  venta.estado = 'Cancelada';
  await em.flush();
}

export async function pagarVenta(data:any, userId:number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (venta.moneda.id !== caja.moneda.id) {
    throw new Conflict('La moneda de la venta no coincide con la moneda de la caja');
  }

  if (caja.monto < Number(data.monto_pagar)) {
    throw new Conflict('Fondos insuficientes');
  }

  const pago = await em.create(Pago, {
    caja: caja,
    monto: Number(data.monto_pagar),
    nombre_caja: caja.nombre,
    nombre_cliente: venta.nombre_cliente,
    nombre_moneda: venta.moneda.nombre,
    id_costo_fijo: 'No asociado',
    id_costo_variable: 'No asociado',
    id_venta: venta.id.toString(),
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  
  venta.total_pagado += Number(data.monto_pagar);
  caja.monto += Number(data.monto_pagar);
  await em.persistAndFlush(caja);
  await em.persistAndFlush(pago);

  const pagos = await em.find(Pago, {venta: venta});
  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

  if (totalPagado === venta.total) {
    venta.estado = 'Paga';
    await em.persistAndFlush(venta);
  }
  if (totalPagado > venta.total) {
    await em.removeAndFlush(pago);
    throw new Conflict('El monto del último pago excede el monto de la venta');
  }

}

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

  em.create(Detalle, {
    venta: venta,
    producto: producto,
    cantidad: Number(data.cantidad),
    precio_unitario: Number(data.precio_unitario),
    descuento: Number(data.descuento),
    subtotal: Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100)),
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });

  venta.total += Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));

  await em.flush();
}

export async function DetalleVenta(userId: number, ventaId: number) {
  const venta = await em.findOne(Venta, {id: ventaId, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  const detalles = await em.find(Detalle, {venta: venta});
  return detalles;
}

export async function delete_Detalle_Venta(userId: number, detalleId: number) {
  const detalle = await em.findOne(Detalle, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  await em.removeAndFlush(detalle);
}

export async function update_Detalle_Venta(data:any, userId: number, detalleId: number) {
  const detalle = await em.findOne(Detalle, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  detalle.cantidad = Number(data.cantidad);
  detalle.precio_unitario = Number(data.precio_unitario);
  detalle.descuento = Number(data.descuento);
  detalle.subtotal = Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));
  detalle.actualizadoEn = new Date();
  await em.flush();
}