import { orm } from '../db/orm.js';
import { Dividendo } from '../entities/Dividendo.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllDividendoSocio(userId: number, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const dividendoSocio = await em.find(Dividendo, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
  return dividendoSocio;
}

export async function getByIdDividendoSocio(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  return dividendo;
}

export async function createDividendoSocio(data:any, userId: number) {
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (data.monto > caja.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  };
  let codigo: string;
  const dividendos = await em.find(Dividendo, {usuario: userId});
  const dividendoConCodigoMasGrande = dividendos.length
  ? dividendos.reduce((max, dividendo) =>
      Number(dividendo.cod) > Number(max.cod) ? dividendo : max
    )
  : '1';
  if (dividendoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(dividendoConCodigoMasGrande.cod) + 1);
  }
  caja.monto -= data.monto;
  const dividendo = await em.create(Dividendo, {
    cod: 'DIV_' + codigo,
    caja: caja,
    monto: data.monto,
    usuario: userId,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
  await em.flush();
}

export async function updateDividendoSocio(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }
  const caja = await em.findOne(Caja, {id: data.caja, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  if (data.monto > caja.monto) {
    throw new Conflict('No hay suficiente saldo en la caja');
  }
  caja.monto -= data.monto;
  dividendo.monto = data.monto;
  dividendo.caja = data.caja;
  await em.flush();
}

export async function removeDividendoSocio(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const dividendo = await em.findOne(Dividendo, {id: id, usuario: userId});
  if (!dividendo) {
    throw new NotFound('Dividendo no encontrado');
  }

  const caja = await em.findOne(Caja, {dividendos: dividendo});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  caja.monto += dividendo.monto;
  await em.flush();
  await em.removeAndFlush(dividendo);
}