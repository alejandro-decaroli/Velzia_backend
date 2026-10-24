import { orm } from '../db/orm.js';
import { Pedido } from '../entities/Pedido.entities.js';
import { Proveedor } from '../entities/Proveedor.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import { LineaPedido } from '../entities/LineaPedido.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { MovF } from '../entities/MovF.entities.js';
import createError from 'http-errors';

const { BadRequest, NotFound, Conflict } = createError;
const em = orm.em;

export async function getAllPedidos(userId?: number, filtroEstado?: string, fecha?: string) {
  const where: any = {};
  if (userId) {
    where.usuario = userId;
  }
  if (filtroEstado) {
    const fNorm = filtroEstado.toLowerCase().trim();
    if (fNorm.startsWith('pag')) {
      where.estado = { $in: ['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos'] };
    } else if (fNorm.startsWith('pend')) {
      where.estado = { $in: ['Pendiente', 'pendiente'] };
    } else {
      where.estado = filtroEstado;
    }
  }
  if (fecha) {
    const fechaDate = new Date(fecha.split('T')[0]);
    const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
    const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
    where.creadoEn = { $gte: inicioMes, $lte: finMes };
  }
  const pedidos = await em.find(Pedido, where, { populate: ['proveedor', 'lineas', 'lineas.producto', 'mov_f'] });
  return pedidos;
}

export async function getByIdPedido(userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const where: any = { id };
  if (userId) {
    where.usuario = userId;
  }
  let pedido = await em.findOne(Pedido, where, { populate: ['proveedor', 'lineas', 'lineas.producto', 'mov_f'] });
  if (!pedido) {
    pedido = await em.findOne(Pedido, { id }, { populate: ['proveedor', 'lineas', 'lineas.producto', 'mov_f'] });
  }
  if (!pedido) {
    throw new NotFound('Pedido no encontrado');
  }
  return pedido;
}

export async function createPedido(data: any, userId?: number) {
  const proveedor = await em.findOne(Proveedor, { id: data.proveedor });
  if (!proveedor) {
    throw new NotFound('Proveedor no encontrado');
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound("Usuario no encontrado");
  }

  let codigo = '1';
  const pedidos = await em.find(Pedido, {});
  if (pedidos.length > 0) {
    const pedidoConCodigoMax = pedidos.reduce((max, ped) => {
      const numPed = Number(ped.cod?.split('_')[1] || 0);
      const numMax = Number(max.cod?.split('_')[1] || 0);
      return numPed > numMax ? ped : max;
    });
    codigo = String(Number(pedidoConCodigoMax.cod?.split('_')[1] || 0) + 1);
  }

  const pedido = em.create(Pedido, {
    cod: 'PE_' + codigo,
    proveedor: proveedor,
    fecha_emision: data.fecha_emision ? new Date(data.fecha_emision) : new Date(),
    fecha_recepcion: data.fecha_recepcion ? new Date(data.fecha_recepcion) : undefined,
    total: Number(data.total || 0),
    estado: 'Pendiente',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  });


  if (Array.isArray(data.lineas) && data.lineas.length > 0) {
    let totalCalculado = 0;
    for (const item of data.lineas) {
      if (item.producto) {
        const producto = await em.findOne(Producto, { id: item.producto });
        if (!producto) {
          throw new NotFound("Producto no encontrado");
        }
        const cantidad = Number(item.cantidad || 0);
        const precio = Number(item.precio || 0);
        const subtotal = item.subtotal !== undefined ? Number(item.subtotal) : cantidad * precio;
        totalCalculado += subtotal;

        const linea = em.create(LineaPedido, {
          pedido: pedido,
          cantidad: cantidad,
          precio: precio,
          subtotal: subtotal,
          producto: producto,
          usuario: usuario,
          creadoEn: new Date(),
          actualizadoEn: new Date(),
        });
        pedido.lineas.add(linea);
    }
    pedido.total = totalCalculado;
      }
      
  }

  await em.persistAndFlush(pedido);
  return pedido;
}

export async function updatePedido(data: any, userId: number, id: number) {
  const pedido = await getByIdPedido(userId, id);

  if (data.proveedor && data.proveedor !== pedido.proveedor.id) {
    const proveedor = await em.findOne(Proveedor, { id: data.proveedor });
    if (!proveedor) {
      throw new NotFound('Proveedor no encontrado');
    }
    pedido.proveedor = proveedor;
  }

  if (data.fecha_emision !== undefined) pedido.fecha_emision = new Date(data.fecha_emision);
  if (data.fecha_recepcion !== undefined) pedido.fecha_recepcion = data.fecha_recepcion ? new Date(data.fecha_recepcion) : undefined;
  if (data.total !== undefined) pedido.total = Number(data.total);
  // Está terminantemente prohibido cambiar de estado mediante el botón de editar
  pedido.actualizadoEn = new Date();

  await em.flush();
  return pedido;
}

export async function removePedido(userId: number, id: number) {
  const pedido = await getByIdPedido(userId, id);
  await em.removeAndFlush(pedido);
}

export async function pagarPedido(data: any, userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const pedido = await getByIdPedido(userId, id);
  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos'].includes(pedido.estado) || pedido.mov_f) {
    throw new Conflict('El pedido ya se encuentra pagado. Solo se permite un único pago.');
  }

  const monto = Number(pedido.total);
  if (monto <= 0) {
    throw new BadRequest('El total del pedido debe ser mayor a 0 para registrar un pago');
  }

  if (data.monto_pagar && Number(data.monto_pagar) !== monto) {
    throw new BadRequest(`El pago debe ser por el total del pedido ($${monto}). No se permiten pagos en cuotas.`);
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const caja = await em.findOne(Caja, { id: data.caja, usuario: userId });
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (Number(caja.monto) < monto) {
    throw new Conflict('Fondos insuficientes en la caja para pagar el pedido');
  }

  let codigo: string;
  const arrayPagos = await em.find(MovF, {usuario: userId});
  const pagoConCodigoMasGrande = arrayPagos.length
  ? arrayPagos.reduce((max, pago) =>
      Number(pago.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? pago : max
    )
  : '1';
  if (pagoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(pagoConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  const pago = em.create(MovF, {
    caja: caja,
    monto: Number(data.monto_pagar || monto),
    cod: 'PA_' + codigo,
    pedido: pedido,
    tipo: 'Egreso',
    categoria: data.categoria || 'pedido',
    descripcion: data.descripcion || `Pago de pedido ${pedido.cod || ('#' + pedido.id)}`,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });

  caja.monto = Number((Number(caja.monto) - monto).toFixed(4));
  caja.actualizadoEn = new Date();
  pedido.estado = 'Pagado';
  pedido.actualizadoEn = new Date();

  await em.persistAndFlush([caja, pedido, pago]);
  return pedido;
}
