import { Request, Response } from 'express';
import { createCaja, getAllCajas, getByIdCaja, removeCaja, updateCaja } from '../services/cajaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const cajas = await getAllCajas(Number(userId));
      res.status(200).json({ message: 'Cajas obtenidas exitosamente', cajas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las cajas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const caja = await getByIdCaja(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Caja encontrada exitosamente', caja });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await createCaja(req.body, Number(userId));
      res.status(201).json({ message: 'Caja creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await updateCaja(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Caja actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeCaja(Number(userId), Number(req.params.id));
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