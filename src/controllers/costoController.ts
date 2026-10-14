import { Request, Response } from 'express';
import {
  createCosto,
  getAllCostos,
  getByIdCosto,
  removeCosto,
  updateCosto,
  pagarCosto
} from '../services/costoService.js';

async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { fecha, filtro }: any = req.query;
    const costos = await getAllCostos(Number(userId), fecha, filtro);
    res.status(200).json({
      message: 'Costos obtenidos exitosamente',
      costos,
      costos_fijos: costos
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los costos' });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const costo = await getByIdCosto(Number(userId), Number(req.params.id));
    res.status(200).json({
      message: 'Costo encontrado exitosamente',
      costo,
      costo_fijo: costo
    });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function create(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await createCosto(req.body, Number(userId));
    res.status(201).json({ message: 'Costo creado exitosamente' });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await updateCosto(req.body, Number(userId), Number(req.params.id));
    res.status(201).json({ message: 'Costo actualizado exitosamente' });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await removeCosto(Number(userId), Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function pagar(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await pagarCosto(req.body, Number(userId), Number(req.params.id));
    res.status(201).json({ message: 'Costo pagado exitosamente' });
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
  remove,
  pagar
};