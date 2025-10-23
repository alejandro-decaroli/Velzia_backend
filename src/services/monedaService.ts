import { orm } from '../db/orm.js';
import { Moneda } from '../entities/Moneda.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
import { Venta } from '../entities/Venta.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Tasa } from '../entities/Tasa.entities.js';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllMoneda(userId: number, fecha: string) {
  if (!fecha) {
    const monedas = await em.find(Moneda, {usuario: userId});
    return monedas;
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const monedas = await em.find(Moneda, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
  return monedas;
}

export async function getByIdMoneda(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido' );
  }

  const moneda = await em.findOne(Moneda, {id:id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }
  return moneda;
}

export async function createMoneda(data:any, userId: number) {
  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre, usuario: userId });
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  if (codigo_iso_duplicado) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  await em.create(Moneda, {
    nombre: data.nombre,
    codigo_iso: data.codigo_iso,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    visible: true
  });
  await em.flush();
}

export async function updateMoneda(data:any, userId: number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const moneda = await em.findOne(Moneda, {id: id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }

  const nombre_duplicado = await em.findOne(Moneda, { nombre: data.nombre, usuario: userId });
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las monedas no pueden tener el mismo nombre');
  }
  const codigo_iso_duplicado = await em.findOne(Moneda, { codigo_iso: data.codigo_iso, usuario: userId });
  if (codigo_iso_duplicado && codigo_iso_duplicado.id !== id) {
    throw new Conflict('Las monedas no pueden tener el mismo código ISO');
  }
 
  moneda.nombre = data.nombre;
  moneda.codigo_iso = data.codigo_iso;
  moneda.actualizadoEn = new Date();
  await em.flush();
}

export async function removeMoneda(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }

  const moneda = await em.findOne(Moneda, {id: id, usuario: userId});
  if (!moneda) {
    throw new NotFound('Moneda no encontrada');
  }

  const ventas = await em.count(Venta, {moneda: moneda});
  const cajas = await em.count(Caja, {moneda: moneda});
  const tasas_origen = await em.count(Tasa, {moneda_origen: moneda});
  const tasas_destino = await em.count(Tasa, {moneda_destino: moneda});
  const costo_fijo = await em.count(CostoFijo, {moneda: moneda});
  const costo_variable = await em.count(CostoVariable, {moneda: moneda});

  if (ventas > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene ventas asociadas');
  }
  if (cajas > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene cajas asociadas');
  }
  if (tasas_origen > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene tasas de origen asociadas');
  }
  if (tasas_destino > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene tasas de destino asociadas');
  }
  if (costo_fijo > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene costos fijos asociados');
  }
  if (costo_variable > 0) {
    throw new Conflict('La moneda no puede ser eliminada porque tiene costos variables asociados');
  }

  await em.removeAndFlush(moneda);
}