import { orm } from '../db/orm.js';
import { Cliente } from '../entities/Cliente.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllClientes(userId: number) {
  const clientes = await em.find(Cliente, {usuario: userId});
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
  const nombre_duplicado = await em.findOne(Cliente, { nombre: data.nombre, usuario: userId });
  const siglas_duplicadas = await em.findOne(Cliente, { siglas: data.siglas, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Los clientes no pueden tener el mismo nombre');
  }
  if (siglas_duplicadas) {
    throw new Conflict('Los clientes no pueden tener las mismas siglas');
  }
  await em.create(Cliente, data);
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
  const nombre_duplicado = await em.findOne(Cliente, { nombre: data.nombre, usuario: userId });
  const siglas_duplicadas = await em.findOne(Cliente, { siglas: data.siglas, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Los clientes no pueden tener el mismo nombre');
  }
  if (siglas_duplicadas) {
    throw new Conflict('Los clientes no pueden tener las mismas siglas');
  }
  cliente.nombre = data.nombre;
  cliente.apellido = data.apellido;
  cliente.direccion = data.direccion;
  cliente.telefono = data.telefono;
  cliente.email = data.email;
  cliente.siglas = data.siglas;
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
  await em.removeAndFlush(cliente);
}