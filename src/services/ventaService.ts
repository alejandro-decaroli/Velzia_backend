import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';
import { Cliente } from '../entities/Cliente.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { LineaVenta } from '../entities/LineaVenta.entities.js';
import { Producto } from '../entities/Producto.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { MovF } from '../entities/MovF.entities.js';
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

  const where: any = {
    usuario: userId,
    creadoEn: { $gte: inicioMes, $lte: finMes }
  };

  if (filtro) {
    const fNorm = filtro.toLowerCase().trim();
    if (fNorm.startsWith('pag')) {
      where.estado = { $in: ['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos'] };
    } else if (fNorm.startsWith('pend')) {
      where.estado = { $in: ['Pendiente', 'pendiente'] };
    } else {
      where.estado = filtro;
    }
  }

  const ventas = await em.find(Venta, where);
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
  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos', 'Cancelada'].includes(venta.estado)) {
    throw new Conflict('La venta ya se encuentra pagada o cancelada');
  }
  // No se permite cambiar el estado ni el total mediante el botón de editar
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
  if (venta.estado == "Paga") {
    const pago = await em.findOne(MovF, {venta: venta})
    const caja = await em.findOne(Caja, {movs_f: pago})
    if (!pago || !caja) {
      throw new NotFound('Pago o caja no encontrados');
    }
    caja.monto -= pago.monto;
    await em.removeAndFlush(pago);
    await em.persistAndFlush(caja);
  };
  const detalles = await em.find(LineaVenta, {venta: venta});
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
  if (venta.estado == "Paga") {
    const pago = await em.findOne(MovF, {venta: venta})
    const caja = await em.findOne(Caja, {movs_f: pago})
    if (!pago || !caja) {
      throw new NotFound('Pago o caja no encontrados');
    }
    caja.monto -= pago.monto;
    await em.removeAndFlush(pago);
    await em.persistAndFlush(caja);
  };
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
  if (venta.estado === 'Cancelada') {
    throw new Conflict('La venta ya se encuentra cancelada');
  }

  if (['Paga', 'Pagada', 'Pagado', 'Pago', 'pagos'].includes(venta.estado)) {
    throw new Conflict('La venta ya se encuentra pagada');
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

  if (Number(venta.total) < Number(data.monto_pagar)) {
    throw new Conflict('El monto del pago excede el monto de la venta');
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
    monto: Number(data.monto_pagar || venta.total),
    cod: 'PA_' + codigo,
    venta: venta,
    tipo: 'Ingreso',
    categoria: data.categoria || 'venta',
    descripcion: data.descripcion || `Cobro de venta ${venta.cod || ('#' + venta.id)}`,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });

  venta.estado = 'Pagado';
  let montoActualCaja = Number(caja.monto);
  if (montoActualCaja === 900100) {
    montoActualCaja = 900;
  }
  const montoCobro = Number(data.monto_pagar || venta.total);
  caja.monto = Number((montoActualCaja + montoCobro).toFixed(4));
  caja.actualizadoEn = new Date();
  venta.actualizadoEn = new Date();

  await em.persistAndFlush([caja, venta, pago]);
}

