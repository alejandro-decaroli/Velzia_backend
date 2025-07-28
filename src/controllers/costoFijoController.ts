import { Request, Response } from 'express';
import { createCostoFijo, getAllCostosFijos, getByIdCostoFijo, removeCostoFijo, updateCostoFijo, getListadoCostosFijosByRangeDate as getListadoCostosFijosByRangeDateService } from '../services/costoFijoService.js';

async function getAll(req: Request, res: Response) {
    try {
      const costosFijos = await getAllCostosFijos();
      res.status(200).json({ message: 'Costos fijos obtenidos exitosamente', costosFijos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos fijos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const costoFijo = await getByIdCostoFijo(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Costo fijo encontrado exitosamente', costoFijo });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const costoFijo = await createCostoFijo(req.body);
      res.status(201).json({ message: 'Costo fijo creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const costoFijo = await updateCostoFijo(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Costo fijo actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      await removeCostoFijo(req.body, Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function getListadoCostosFijosByRangeDate(req: Request, res: Response) {
    try {
      const costosFijos = await getListadoCostosFijosByRangeDateService(req.body);
      res.status(200).json({ message: 'Costos fijos obtenidos exitosamente', costosFijos });
    } catch (error:any) {
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
  getListadoCostosFijosByRangeDate
};