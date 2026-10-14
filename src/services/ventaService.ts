import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Cliente } from '../entities/Cliente.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { Detalle } from '../entities/Detalle.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Caja } from '../entities/Caja.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllVentas(userId: number, filtro: string, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);

  if (filtro) {
    const ventas = await em.find(Venta, {
      usuario: userId,
      creadoEn: { $gte: inicioMes, $lte: finMes },
      estado: filtro as any
    });
    return ventas;
  } else {
    const ventas = await em.find(Venta, {
      usuario: userId,
      creadoEn: { $gte: inicioMes, $lte: finMes }
    });
    return ventas;
  }
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
  const cliente = await em.findOne(Cliente, {id: data.cliente, usuario: userId});
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  let codigo: string;
  const ventas = await em.find(Venta, {usuario: userId});
  const ventaConCodigoMasGrande = ventas.length
  ? ventas.reduce((max, venta) =>
      Number(venta.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? venta : max
    )
  : '1';
  if (ventaConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(ventaConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  const venta = em.create(Venta, {
    cod: 'VEN_' + codigo,
    cliente,
    total: 0,
    total_pagado: 0,
    estado: 'Pendiente',
    usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
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
  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  venta.total = data.total;
  venta.total_pagado = data.total_pagado;
  venta.cliente = cliente;
  venta.actualizadoEn = new Date();
  await em.persistAndFlush(venta);
}

export async function removeVenta(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const venta = await em.findOne(Venta, {id: id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }

  const detalles = await em.find(Detalle, {venta: venta});
  detalles.forEach(async detalle => {
    detalle.producto.stock += detalle.cantidad;
    await em.removeAndFlush(detalle);
  });

  await em.removeAndFlush(venta);
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
  const venta = await em.findOne(Venta, {id: id, usuario: userId}, { populate: ['pago'] });
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  if (venta.estado === 'Cancelada') {
    throw new Conflict('La venta ya se encuentra cancelada');
  }
  if (venta.estado === 'Paga' || venta.pago) {
    throw new Conflict('La venta ya se encuentra pagada. Solo se permite un único pago.');
  }

  if (Number(venta.total) <= 0) {
    throw new BadRequest('La venta debe tener un total mayor a 0 para registrar un pago');
  }

  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  // No se permite pago en cuotas: debe pagarse el total de la venta
  const monto = Number(venta.total);
  if (data.monto_pagar && Number(data.monto_pagar) !== monto) {
    throw new BadRequest(`El pago debe ser por el total de la venta ($${monto}). No se permiten pagos en cuotas.`);
  }

  let codigo: string;

  venta.total_pagado = monto;
  venta.estado = 'Paga';
  caja.monto += monto;

  await em.persistAndFlush(caja);
  await em.persistAndFlush(venta);
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

  if (producto.stock < Number(data.cantidad)) {
    throw new Conflict('Stock insuficiente');
  }

  let codigo: string;
  const cant_detalles = await em.find(Detalle, {usuario: userId});
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
  const detalle = em.create(Detalle, {
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
  const detalles = await em.find(Detalle, {venta: venta});
  return detalles;
}

export async function DetalleVentaById(userId: number, detalleId: number) {
  const detalle = await em.findOne(Detalle, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  return detalle;
}


export async function delete_Detalle_Venta(userId: number, detalleId: number) {
  const detalle = await em.findOne(Detalle, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  const venta = await em.findOne(Venta, {id: detalle.venta.id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  venta.total -= detalle.subtotal;
  await em.removeAndFlush(detalle);
  await em.persistAndFlush(venta);
}

export function detallesByUser(userId: number) {
  const detalles = em.find(Detalle, {usuario: userId});
  return detalles;
}

export async function update_Detalle_Venta(data:any, userId: number, detalleId: number) {
  const detalle = await em.findOne(Detalle, {id: detalleId, usuario: userId});
  if (!detalle) {
    throw new NotFound('Detalle no encontrado');
  }
  const venta = await em.findOne(Venta, {id: detalle.venta.id, usuario: userId});
  if (!venta) {
    throw new NotFound('Venta no encontrada');
  }
  detalle.cantidad = Number(data.cantidad);
  detalle.precio_unitario = Number(data.precio_unitario);
  detalle.descuento = Number(data.descuento);
  detalle.subtotal = Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));
  venta.total -= detalle.subtotal;
  venta.total += Number(data.cantidad * data.precio_unitario * ((100 - data.descuento) / 100));
  detalle.actualizadoEn = new Date();
  await em.persistAndFlush(detalle);
  await em.persistAndFlush(venta);
}