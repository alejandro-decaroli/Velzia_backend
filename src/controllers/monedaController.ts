import { Request, Response } from 'express';
import { createMoneda, getAllMoneda, getByIdMoneda, removeMoneda, updateMoneda } from '../services/monedaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const moneda = await getAllMoneda();
      res.status(200).json({ message: 'Monedas obtenidas exitosamente', moneda });
    } catch (error:any) {
      res.status(500).json({ error: 'Error al obtener las monedas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const moneda = await getByIdMoneda(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Moneda encontrada exitosamente', moneda });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const moneda = await createMoneda(req.body);
      res.status(201).json({ message: 'Moneda creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const moneda = await updateMoneda(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Moneda actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const moneda = await removeMoneda(req.body, Number(req.params.id));
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