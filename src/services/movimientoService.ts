import { orm } from '../db/orm.js';
import { MovF } from '../entities/MovF.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound } = createError;

const em = orm.em;

export async function getAllMovimientos(
  userId: number,
  fecha?: string,
  filtro?: string,
  categoria?: string
) {
  const whereClause: any = { usuario: userId };

  if (fecha) {
    const fechaTrim = fecha.split('T')[0];
    const fechaDate = new Date(fechaTrim);
    if (!isNaN(fechaDate.getTime())) {
      // Si se pasa fecha, incluimos los movimientos hasta el final de ese día
      const finDia = new Date(fechaTrim + 'T23:59:59.999Z');
      whereClause.creadoEn = { $lte: finDia };
    }
  }

  if (filtro) {
    const filtroNorm = filtro.trim().toLowerCase();
    if (filtroNorm === 'ingreso' || filtroNorm === 'ingresos') {
      whereClause.tipo = 'Ingreso';
    } else if (filtroNorm === 'egreso' || filtroNorm === 'egresos') {
      whereClause.tipo = 'Egreso';
      whereClause.categoria = { $ne: 'transferencia' };
    } else if (filtroNorm === 'transferencia' || filtroNorm === 'transferencias') {
      whereClause.$or = [
        { tipo: 'Transferencia' },
        { categoria: 'transferencia' }
      ];
    } else {
      whereClause.categoria = { $ilike: `%${filtro.trim()}%` };
    }
  }

  if (categoria) {
    whereClause.categoria = { $ilike: `%${categoria.trim()}%` };
  }

  const movimientos = await em.find(
    MovF,
    whereClause,
    {
      populate: ['caja', 'venta', 'costo', 'pedido'],
      orderBy: { creadoEn: 'DESC', id: 'DESC' }
    }
  );

  return movimientos.map((m) => {
    let referencia = '-';
    if (m.venta) {
      referencia = m.venta.cod || `Venta #${m.venta.id}`;
    } else if (m.costo) {
      referencia = m.costo.cod || m.costo.descripcion || `Costo #${m.costo.id}`;
    } else if (m.pedido) {
      referencia = m.pedido.cod || `Pedido #${m.pedido.id}`;
    }

    const tipo = m.categoria?.toLowerCase() === 'transferencia' ? 'Transferencia' : m.tipo;

    return {
      id: m.id,
      cod: m.cod,
      tipo,
      categoria: m.categoria,
      descripcion: m.descripcion,
      monto: Number(m.monto),
      creadoEn: m.creadoEn,
      actualizadoEn: m.actualizadoEn,
      caja: m.caja ? { id: m.caja.id, nombre: m.caja.nombre, cod: m.caja.cod } : null,
      nombre_caja: m.caja?.nombre || '-',
      venta: m.venta ? { id: m.venta.id, cod: m.venta.cod } : null,
      costo: m.costo ? { id: m.costo.id, cod: m.costo.cod } : null,
      pedido: m.pedido ? { id: m.pedido.id, cod: m.pedido.cod } : null,
      referencia
    };
  });
}

export async function getByIdMovimiento(userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo o inválido');
  }

  const m = await em.findOne(
    MovF,
    { id, usuario: userId },
    { populate: ['caja', 'venta', 'costo', 'pedido'] }
  );

  if (!m) {
    throw new NotFound('Movimiento financiero no encontrado');
  }

  let referencia = '-';
  if (m.venta) {
    referencia = m.venta.cod || `Venta #${m.venta.id}`;
  } else if (m.costo) {
    referencia = m.costo.cod || m.costo.descripcion || `Costo #${m.costo.id}`;
  } else if (m.pedido) {
    referencia = m.pedido.cod || `Pedido #${m.pedido.id}`;
  }

  const tipo = m.categoria?.toLowerCase() === 'transferencia' ? 'Transferencia' : m.tipo;

  return {
    id: m.id,
    cod: m.cod,
    tipo,
    categoria: m.categoria,
    descripcion: m.descripcion,
    monto: Number(m.monto),
    creadoEn: m.creadoEn,
    actualizadoEn: m.actualizadoEn,
    caja: m.caja ? { id: m.caja.id, nombre: m.caja.nombre, cod: m.caja.cod } : null,
    nombre_caja: m.caja?.nombre || '-',
    venta: m.venta ? { id: m.venta.id, cod: m.venta.cod } : null,
    costo: m.costo ? { id: m.costo.id, cod: m.costo.cod } : null,
    pedido: m.pedido ? { id: m.pedido.id, cod: m.pedido.cod } : null,
    referencia
  };
}
