import { Request, Response } from 'express';
import {
  createProveedor,
  getAllProveedores,
  getByIdProveedor,
  removeProveedor,
  updateProveedor
} from '../services/proveedorService.js';

async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { fecha }: any = req.query;
    const proveedores = await getAllProveedores(userId ? Number(userId) : undefined, fecha);
    res.status(200).json({ message: 'Proveedores obtenidos exitosamente', proveedores });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al obtener los proveedores', error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const proveedor = await getByIdProveedor(Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Proveedor encontrado exitosamente', proveedor });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function create(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const proveedor = await createProveedor(req.body, userId ? Number(userId) : undefined);
    res.status(201).json({ message: 'Proveedor creado exitosamente', proveedor });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const proveedor = await updateProveedor(req.body, Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Proveedor actualizado exitosamente', proveedor });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await removeProveedor(Number(userId), Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};
