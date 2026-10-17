import { orm } from '../db/orm.js';
import { Costo } from '../entities/Costo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import { MovF } from "../entities/MovF.entities.js";
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCostos(userId: number, fecha: string, filtro: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  if (!filtro) {
    const costos = await em.find(Costo, { usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes } });
    return costos;
  }
  const estadoFiltro = filtro === 'Paga' ? 'Pagada' : filtro;
  const costos = await em.find(Costo, { usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }, estado: estadoFiltro as any });
  return costos;
}

export async function getByIdCosto(userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const costo = await em.findOne(Costo, { id: id, usuario: userId });
  if (!costo) {
    throw new NotFound('Costo no encontrado');
  }

  return costo;
}

export async function createCosto(data: any, userId: number) {
  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  let codigo: string;
  const costos = await em.find(Costo, { usuario: userId });
  const costoConCodigoMasGrande = costos.length
    ? costos.reduce((max, costo) =>
        Number(costo.cod?.split('_')[1] || 0) > Number(max.cod?.split('_')[1] || 0) ? costo : max
      )
    : null;
  if (!costoConCodigoMasGrande || !costoConCodigoMasGrande.cod) {
    codigo = '1';
  } else {
    codigo = String(Number(costoConCodigoMasGrande.cod.split('_')[1]) + 1);
  }
  await em.create(Costo, {
    cod: 'CO_' + codigo,
    categoria: data.categoria,
    descripcion: data.descripcion,
    monto: Number(data.monto),
    estado: data.estado || 'Pendiente',
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
  await em.flush();
}

export async function updateCosto(data: any, userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costo = await em.findOne(Costo, { id: id, usuario: userId });
  if (!costo) {
    throw new NotFound('Costo no encontrado');
  }
  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  costo.categoria = data.categoria;
  costo.descripcion = data.descripcion;
  costo.monto = Number(data.monto);
  if (data.estado) {
    costo.estado = data.estado;
  }
  costo.actualizadoEn = new Date();
  await em.flush();
}

export async function removeCosto(userId: any, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costo = await em.findOne(Costo, { id: id, usuario: userId });
  if (!costo) {
    throw new NotFound('Costo no encontrado');
  }
  await em.removeAndFlush(costo);
}

export async function pagarCosto(data: any, userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const costo = await em.findOne(Costo, { id: id, usuario: userId }, { populate: ['mov_f'] });
  if (!costo) {
    throw new NotFound('Costo no encontrado');
  }
  if (costo.estado === 'Pagada' || costo.mov_f) {
    throw new Conflict('El costo ya se encuentra pagado. Solo se permite un único pago.');
  }

  const monto = Number(costo.monto);
  if (monto <= 0) {
    throw new BadRequest('El monto del costo debe ser mayor a 0 para registrar un pago');
  }

  if (data.monto_pagar && Number(data.monto_pagar) !== monto) {
    throw new BadRequest(`El pago debe ser por el total del costo ($${monto}). No se permiten pagos en cuotas.`);
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const caja = await em.findOne(Caja, { id: data.caja, usuario: userId });
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  if (caja.monto < monto) {
    throw new Conflict('Fondos insuficientes en la caja para cubrir el costo');
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
  const pago = await em.create(MovF, {
    caja: caja,
    monto: Number(data.monto_pagar),
    cod: 'PA_' + codigo,
    costo: costo,
    tipo: 'Ingreso',
    categoria: data.categoria,
    descripcion: data.descripcion,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });

  caja.monto -= monto;
  costo.estado = 'Pagada';

  await em.persistAndFlush(caja);
  await em.persistAndFlush(costo);
  await em.persistAndFlush(pago);
}

export const getAllCostosFijos = getAllCostos;
export const getByIdCostoFijo = getByIdCosto;
export const createCostoFijo = createCosto;
export const updateCostoFijo = updateCosto;
export const removeCostoFijo = removeCosto;
export const pagarCostoFijo = pagarCosto;