import { Request, Response } from 'express';
import { createCaja, getAllCajas, getByIdCaja, removeCaja, updateCaja } from '../services/cajaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const cajas = await getAllCajas();
      res.status(200).json({ message: 'Cajas obtenidas exitosamente', cajas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las cajas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const caja = await getByIdCaja(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Caja encontrada exitosamente', caja });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const caja = await createCaja(req.body);
      res.status(201).json({ message: 'Caja creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const caja = await updateCaja(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Caja actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const caja = await removeCaja(req.body, Number(req.params.id));
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