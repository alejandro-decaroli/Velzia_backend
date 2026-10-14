import { orm } from '../db/orm.js';
import { Proveedor } from '../entities/Proveedor.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';
import { Pedido } from '../entities/Pedido.entities.js';
import createError from 'http-errors';

const { BadRequest, NotFound, Conflict } = createError;
const em = orm.em;

export async function getAllProveedores(userId?: number, fecha?: string) {
  const where: any = {};
  if (userId) {
    where.usuario = userId;
  }
  if (fecha) {
    const fechaDate = new Date(fecha.split('T')[0]);
    const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
    const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);
    where.creadoEn = { $gte: inicioMes, $lte: finMes };
  }
  const proveedores = await em.find(Proveedor, where, { populate: ['pedidos'] });
  return proveedores;
}

export async function getByIdProveedor(userId: number, id: number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo o inválido');
  }
  const where: any = { id };
  if (userId) {
    where.usuario = userId;
  }
  let proveedor = await em.findOne(Proveedor, where, { populate: ['pedidos'] });
  if (!proveedor) {
    // Si no lo encuentra con usuario específico, intentar buscarlo por ID
    proveedor = await em.findOne(Proveedor, { id }, { populate: ['pedidos'] });
  }
  if (!proveedor) {
    throw new NotFound('Proveedor no encontrado');
  }
  return proveedor;
}

export async function createProveedor(data: any, userId?: number) {
  const cuitDuplicado = await em.findOne(Proveedor, { cuit: data.cuit });
  if (cuitDuplicado) {
    throw new Conflict('Ya existe un proveedor con el mismo CUIT');
  }

  let usuario: Usuario | null = null;
  if (userId) {
    usuario = await em.findOne(Usuario, { id: userId });
  }

  let codigo = '1';
  const proveedores = await em.find(Proveedor, {});
  if (proveedores.length > 0) {
    const provConCodigoMax = proveedores.reduce((max, prov) => {
      const numProv = Number(prov.cod?.split('_')[1] || 0);
      const numMax = Number(max.cod?.split('_')[1] || 0);
      return numProv > numMax ? prov : max;
    });
    codigo = String(Number(provConCodigoMax.cod?.split('_')[1] || 0) + 1);
  }

  const nuevoProveedor = em.create(Proveedor, {
    cod: 'PR_' + codigo,
    razon_social: data.razon_social,
    cuit: data.cuit,
    telefono: data.telefono,
    email: data.email,
    direccion: data.direccion,
    usuario: usuario || undefined,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  });

  await em.persistAndFlush(nuevoProveedor);
  return nuevoProveedor;
}

export async function updateProveedor(data: any, userId: number, id: number) {
  const proveedor = await getByIdProveedor(userId, id);

  if (data.cuit && data.cuit !== proveedor.cuit) {
    const cuitDuplicado = await em.findOne(Proveedor, { cuit: data.cuit });
    if (cuitDuplicado && cuitDuplicado.id !== proveedor.id) {
      throw new Conflict('Ya existe otro proveedor con el mismo CUIT');
    }
  }

  if (data.razon_social !== undefined) proveedor.razon_social = data.razon_social;
  if (data.cuit !== undefined) proveedor.cuit = data.cuit;
  if (data.telefono !== undefined) proveedor.telefono = data.telefono;
  if (data.email !== undefined) proveedor.email = data.email;
  if (data.direccion !== undefined) proveedor.direccion = data.direccion;
  proveedor.actualizadoEn = new Date();

  await em.flush();
  return proveedor;
}

export async function removeProveedor(userId: number, id: number) {
  const proveedor = await getByIdProveedor(userId, id);

  const pedidos = await em.count(Pedido, { proveedor: proveedor });
  if (pedidos > 0) {
    throw new Conflict('El proveedor no puede ser eliminado porque tiene pedidos asociados');
  }

  await em.removeAndFlush(proveedor);
}
