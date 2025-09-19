import { Request, Response } from 'express';
import { createCostoVariable, getAllCostosVariables, getByIdCostoVariable, removeCostoVariable, updateCostoVariable, pagarCostoVariable } from '../services/costoVariableService.js';

async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const costos_variables = await getAllCostosVariables(Number(userId));
      res.status(200).json({ message: 'Costos variables obtenidos exitosamente', costos_variables });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos variables' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const costos_variables = await getByIdCostoVariable(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Costo variable encontrado exitosamente', costos_variables });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await createCostoVariable(req.body, Number(userId));
      res.status(201).json({ message: 'Costo variable creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await updateCostoVariable(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Costo variable actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeCostoVariable(Number(userId), Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function pagar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await pagarCostoVariable(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Costo variable pagado exitosamente'});
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