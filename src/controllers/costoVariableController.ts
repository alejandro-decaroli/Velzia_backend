import { Request, Response } from 'express';
import { createCostoVariable, getAllCostosVariables, getByIdCostoVariable, removeCostoVariable } from '../services/costoVariableService.js';

async function getAll(req: Request, res: Response) {
    try {
      const costosVariables = await getAllCostosVariables();
      res.status(200).json({ message: 'Costos variables obtenidos exitosamente', costosVariables });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos variables' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const costoVariable = await getByIdCostoVariable(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Costo variable encontrado exitosamente', costoVariable });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const costoVariable = await createCostoVariable(req.body);
      res.status(201).json({ message: 'Costo variable creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const costoVariable = await getByIdCostoVariable(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Costo variable actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      await removeCostoVariable(req.body, Number(req.params.id));
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