import { orm } from '../db/orm.js';
import { Producto } from '../entities/Producto.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import { LineaVenta } from '../entities/LineaVenta.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllProductos(userId: number, fecha: string) {
  if (!fecha) {
    fecha = new Date().toISOString().split('T')[0];
  } else {
    fecha = fecha.split('T')[0];
  }
  const fechaDate = new Date(fecha);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const productos = await em.find(Producto, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
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
    let codigo: string;
    const productos = await em.find(Producto, {usuario: userId});
    const productoConCodigoMasGrande = productos.length
    ? productos.reduce((max, producto) =>
        Number(producto.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? producto : max
      )
    : '1';
    if (productoConCodigoMasGrande === '1') {
      codigo = '1';
    } else {
      codigo = String(Number(productoConCodigoMasGrande.cod?.split('_')[1]) + 1);
    }
    const costoActual = Number(data.costo_actual ?? data.costoActual ?? 0);
    const precioVenta = Number(data.precio_venta ?? data.precioVenta ?? 0);
    if (costoActual >= precioVenta) {
      throw new BadRequest('El costo actual debe ser menor al precio de venta');
    }

    await em.create(Producto, {
        cod: 'PRO_' + codigo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        stock: data.stock,
        costo_actual: costoActual,
        precio_venta: precioVenta,
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
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

  const costoActual = data.costo_actual !== undefined || data.costoActual !== undefined
    ? Number(data.costo_actual ?? data.costoActual)
    : Number(producto.costo_actual);
  const precioVenta = data.precio_venta !== undefined || data.precioVenta !== undefined
    ? Number(data.precio_venta ?? data.precioVenta)
    : Number(producto.precio_venta);

  if (costoActual >= precioVenta) {
    throw new BadRequest('El costo actual debe ser menor al precio de venta');
  }

  producto.nombre = data.nombre;
  producto.descripcion = data.descripcion;
  producto.stock = data.stock;
  producto.costo_actual = costoActual;
  producto.precio_venta = precioVenta;
  producto.actualizadoEn = new Date();
  await em.flush();
}

export async function removeProducto(userId: number, id:number){
  const producto = await getByIdProducto(userId, id);
  const detalles = await em.count(LineaVenta, {producto: producto});
  if (detalles > 0) {
    throw new Conflict('No se puede eliminar el producto porque tiene lineas de venta asociadas');
  }
  await em.removeAndFlush(producto);
}