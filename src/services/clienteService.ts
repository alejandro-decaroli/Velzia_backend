import { orm } from '../db/orm.js';
import { Cliente } from '../entities/Cliente.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { Venta } from '../entities/Venta.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllClientes(userId: number) {
  const clientes = await em.find(Cliente, {usuario: {id: userId}});
  return clientes;
}

export async function getByIdCliente(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const cliente = await em.findOne(Cliente, {id: id, usuario: userId});
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  return cliente;
}

export async function createCliente(data:any, userId: number) {
  const nombre_duplicado = await em.findOne(Cliente, { nombre: data.nombre, apellido: data.apellido, usuario: {id: userId} });
  if (nombre_duplicado) {
    throw new Conflict('Los clientes no pueden tener el mismo nombre y apellido');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  await em.create(Cliente, {
    nombre: data.nombre,
    apellido: data.apellido,
    telefono: data.telefono,
    email: data.email,
    direccion: data.direccion,
    visible: true,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
  await em.flush();
}

export async function updateCliente(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const cliente = await em.findOne(Cliente, {id: id, usuario: userId});
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  const nombre_duplicado = await em.findOne(Cliente, { nombre: data.nombre, apellido: data.apellido, usuario: {id: userId} });
  if (nombre_duplicado && nombre_duplicado.id !== cliente.id) {
    throw new Conflict('Los clientes no pueden tener el mismo nombre y apellido');
  }
  cliente.nombre = data.nombre;
  cliente.apellido = data.apellido;
  cliente.direccion = data.direccion;
  cliente.telefono = data.telefono;
  cliente.email = data.email;
  cliente.actualizadoEn = new Date();
  await em.flush();
}

export async function removeCliente(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('ID inválido');
  }
  const cliente = await em.findOne(Cliente, {id: id, usuario: userId});
  if (!cliente) {
    throw new NotFound('Cliente no encontrado');
  }
  const ventas = await em.count(Venta, {cliente: cliente, usuario: userId});
  if (ventas > 0) {
    throw new Conflict('El cliente no puede ser eliminado porque tiene ventas asociadas');
  }
  await em.removeAndFlush(cliente);
}