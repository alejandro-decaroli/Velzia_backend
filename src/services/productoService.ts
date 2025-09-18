import { orm } from '../db/orm.js';
import { Producto } from '../entities/Producto.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllProductos(userId: number) {
  const productos = await em.find(Producto, {usuario: userId});
  return productos;
}

export async function getByIdProducto(userId: number, id:number) {

  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }

  const producto = await em.findOne(Producto, {id: id, usuario: userId});
  if (!producto) {
    throw new NotFound('Producto no encontrado');
  }

  return producto;
}

export async function createProducto(data: any, userId: number) {
    const usuario = await em.findOne(Usuario, {id: userId});
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    const nombre_duplicado = await em.findOne(Producto, { nombre: data.nombre, usuario: {id: userId} });
    if (nombre_duplicado) {
        throw new Conflict('Los productos no pueden tener el mismo nombre');
    }
    await em.create(Producto, {
        nombre: data.nombre,
        descripcion: data.descripcion,
        stock: data.stock,
        usuario: usuario,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await em.flush();
}

export async function updateProducto(data:any, userId: number, id:number) {
  const producto = await getByIdProducto(userId, id);
  if (!producto) {
    throw new NotFound('Producto no encontrado');
  }
  const nombre_duplicado = await em.findOne(Producto, { nombre: data.nombre, usuario: {id: userId} });
  if (nombre_duplicado && nombre_duplicado.id !== producto.id) {
    throw new Conflict('Los productos no pueden tener el mismo nombre');
  }
  producto.nombre = data.nombre;
  producto.descripcion = data.descripcion;
  producto.stock = data.stock;
  await em.flush();
}

export async function removeProducto(userId: number, id:number){
  const producto = await getByIdProducto(userId, id);
  await em.removeAndFlush(producto);
}