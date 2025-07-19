import { Request, Response } from 'express';
import { createTasa, getAllTasas, getByIdTasa, removeTasa, updateTasa } from '../services/tasaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const tasas = await getAllTasas();
      res.status(200).json({ message: 'Tasas obtenidas exitosamente', tasas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las tasas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const tasa = await getByIdTasa(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Tasa encontrada exitosamente', tasa });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    
    }
}

async function create(req: Request, res: Response) {
    try {
      const tasa = await createTasa(req.body);
      res.status(201).json({ message: 'Tasa creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    
    }
}

async function update(req: Request, res: Response) {
    try {
      const tasa = await updateTasa(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Tasa actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });   
    }
}

async function remove(req: Request, res: Response) {
    try {
      const tasa = await removeTasa(req.body, Number(req.params.id));
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