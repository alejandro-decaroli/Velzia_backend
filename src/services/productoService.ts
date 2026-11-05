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

export async function createBulkProductos(productosData: any[], userId: number) {
  if (!Array.isArray(productosData) || productosData.length === 0) {
    throw new BadRequest('Debe enviar una lista de productos para importar');
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const productosExistentes = await em.find(Producto, { usuario: userId });
  const nombresExistentes = new Set(productosExistentes.map(p => p.nombre.trim().toLowerCase()));

  let maxCodigoNum = 0;
  productosExistentes.forEach(p => {
    const num = Number(p.cod?.split('_')[1]);
    if (!isNaN(num) && num > maxCodigoNum) {
      maxCodigoNum = num;
    }
  });

  const nombresEnLote = new Set<string>();
  const nuevosProductos: Producto[] = [];
  const errores: { fila: number; nombre: string; error: string }[] = [];

  for (let i = 0; i < productosData.length; i++) {
    const item = productosData[i];
    const fila = i + 1;
    const nombre = String(item.nombre || '').trim();

    if (!nombre || nombre.length < 2) {
      errores.push({ fila, nombre: nombre || `Fila ${fila}`, error: 'El nombre es obligatorio (mínimo 2 caracteres)' });
      continue;
    }
    if (nombre.length > 20) {
      errores.push({ fila, nombre, error: 'El nombre no puede superar los 20 caracteres' });
      continue;
    }

    const normNombre = nombre.toLowerCase();
    if (nombresExistentes.has(normNombre)) {
      errores.push({ fila, nombre, error: `Ya existe un producto registrado con el nombre "${nombre}"` });
      continue;
    }
    if (nombresEnLote.has(normNombre)) {
      errores.push({ fila, nombre, error: `Nombre duplicado en el mismo archivo Excel` });
      continue;
    }

    const stock = Number(item.stock ?? 0);
    if (isNaN(stock) || stock < 0) {
      errores.push({ fila, nombre, error: 'El stock debe ser un número entero o decimal mayor o igual a 0' });
      continue;
    }

    const costoActual = Number(item.costo_actual ?? item.costoActual ?? item.costo ?? 0);
    const precioVenta = Number(item.precio_venta ?? item.precioVenta ?? item.precio ?? 0);

    if (isNaN(costoActual) || costoActual < 0) {
      errores.push({ fila, nombre, error: 'El costo actual debe ser un número mayor o igual a 0' });
      continue;
    }
    if (isNaN(precioVenta) || precioVenta <= 0) {
      errores.push({ fila, nombre, error: 'El precio de venta debe ser un número mayor a 0' });
      continue;
    }
    if (costoActual >= precioVenta) {
      errores.push({ fila, nombre, error: `El costo ($${costoActual}) debe ser menor al precio de venta ($${precioVenta})` });
      continue;
    }

    maxCodigoNum++;
    nombresEnLote.add(normNombre);

    const prod = em.create(Producto, {
      cod: 'PRO_' + maxCodigoNum,
      nombre: nombre,
      descripcion: item.descripcion ? String(item.descripcion).substring(0, 100) : '',
      stock: stock,
      costo_actual: costoActual,
      precio_venta: precioVenta,
      usuario: usuario,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    nuevosProductos.push(prod);
  }

  if (nuevosProductos.length > 0) {
    await em.persistAndFlush(nuevosProductos);
  }

  return {
    insertados: nuevosProductos.length,
    fallidos: errores.length,
    errores,
    productos: nuevosProductos
  };
}