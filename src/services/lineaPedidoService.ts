import { orm } from '../db/orm.js';
import { LineaPedido } from '../entities/LineaPedido.entities.js';
import { Pedido } from '../entities/Pedido.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';

const { BadRequest, NotFound } = createError;
const em = orm.em;

export async function getAllLineasPedido(userId?: number, pedidoId?: number) {
  const where: any = {};
  if (pedidoId) {
    where.pedido = pedidoId;
  }
  if (userId) {
    where.usuario = userId;
  }
  const lineas = await em.find(LineaPedido, where, { populate: ['pedido', 'producto'] });
  return lineas;
}

export async function getByIdLineaPedido(userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  let linea = await em.findOne(LineaPedido, { id }, { populate: ['pedido', 'producto'] });
  if (!linea) {
    throw new NotFound('Línea de pedido no encontrada');
  }
  return linea;
}

export async function createLineaPedido(data: any, userId?: number) {
  const pedidoId = data.pedido || data.pedidoId;
  if (!pedidoId) {
    throw new BadRequest('El ID del pedido es requerido');
  }
  const pedido = await em.findOne(Pedido, { id: Number(pedidoId) });
  if (!pedido) {
    throw new NotFound('Pedido no encontrado');
  }

  
  const producto = await em.findOne(Producto, { id: Number(data.producto) });
  if (!producto) {
    throw new NotFound('Producto no encontrado');
  }

  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  let codigo = '1';
  const cantLineas = await em.find(LineaPedido, {});
  if (cantLineas.length > 0) {
    const lineaConCodigoMax = cantLineas.reduce((max, linea) => {
      const numLin = Number(linea.cod?.split('_')[1] || 0);
      const numMax = Number(max.cod?.split('_')[1] || 0);
      return numLin > numMax ? linea : max;
    });
    codigo = String(Number(lineaConCodigoMax.cod?.split('_')[1] || 0) + 1);
  }

  const cantidad = Number(data.cantidad);
  const precio = Number(data.precio);
  const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : cantidad * precio;

  const linea = em.create(LineaPedido, {
    cod: 'LP_' + codigo,
    pedido: pedido,
    producto: producto,
    cantidad: cantidad,
    precio: precio,
    subtotal: subtotal,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  });

  pedido.total = Number(pedido.total || 0) + subtotal;

  await em.persistAndFlush(linea);
  await em.persistAndFlush(pedido);
  return linea;
}

export async function updateLineaPedido(data: any, userId: number, id: number) {
  const linea = await getByIdLineaPedido(userId, id);
  const pedido = await em.findOne(Pedido, { id: linea.pedido.id });

  if (data.producto !== undefined) {
    const producto = await em.findOne(Producto, { id: Number(data.producto) });
    if (!producto) {
      throw new NotFound('Producto no encontrado');
    }
    linea.producto = producto;
  }

  const cantidad = data.cantidad !== undefined ? Number(data.cantidad) : linea.cantidad;
  const precio = data.precio !== undefined ? Number(data.precio) : linea.precio;
  const nuevoSubtotal = data.subtotal !== undefined ? Number(data.subtotal) : cantidad * precio;

  if (pedido) {
    pedido.total = Number(pedido.total || 0) - Number(linea.subtotal) + nuevoSubtotal;
    await em.persistAndFlush(pedido);
  }

  linea.cantidad = cantidad;
  linea.precio = precio;
  linea.subtotal = nuevoSubtotal;
  linea.actualizadoEn = new Date();

  await em.flush();
  return linea;
}

export async function removeLineaPedido(userId: number, id: number) {
  const linea = await getByIdLineaPedido(userId, id);
  const pedido = await em.findOne(Pedido, { id: linea.pedido.id });

  if (pedido) {
    pedido.total = Math.max(0, Number(pedido.total || 0) - Number(linea.subtotal));
    await em.persistAndFlush(pedido);
  }

  await em.removeAndFlush(linea);
}

export async function getLineasByPedido(pedidoId: number) {
  const lineas = await em.find(LineaPedido, { pedido: pedidoId }, { populate: ['producto', 'pedido'] });
  return lineas;
}
