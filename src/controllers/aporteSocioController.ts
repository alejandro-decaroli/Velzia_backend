import { Request, Response } from 'express';
import { createAporte, getAllAportes, getByIdAportes, removeAporte, updateAporte } from '../services/aporteSocioService.js';

async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const aportes = await getAllAportes(Number(userId));
      res.status(200).json({ message: 'Aportes de socios obtenidos exitosamente', aportes });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los aportes de socios' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const aporte = await getByIdAportes(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Aporte socio encontrado exitosamente', aporte });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const aporte = await createAporte(req.body, Number(userId));
      res.status(201).json({ message: 'Aporte socio creado exitosamente', aporte });
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const aporte = await updateAporte(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Aporte socio actualizado exitosamente', aporte });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeAporte(Number(userId), Number(req.params.id));
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
