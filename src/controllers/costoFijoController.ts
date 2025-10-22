import { Request, Response } from 'express';
import { createCostoFijo, getAllCostosFijos, getByIdCostoFijo, removeCostoFijo, updateCostoFijo, getListadoCostosFijosByRangeDate as getListadoCostosFijosByRangeDateService, pagarCostoFijo } from '../services/costoFijoService.js';

async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const {fecha} : any = req.query;
      const costos_fijos = await getAllCostosFijos(Number(userId), fecha);
      res.status(200).json({ message: 'Costos fijos obtenidos exitosamente', costos_fijos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos fijos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const costo_fijo = await getByIdCostoFijo(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Costo fijo encontrado exitosamente', costo_fijo });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await createCostoFijo(req.body, Number(userId));
      res.status(201).json({ message: 'Costo fijo creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await updateCostoFijo(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Costo fijo actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeCostoFijo(Number(userId), Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function getListadoCostosFijosByRangeDate(req: Request, res: Response) {
    try {
      const costos_fijos = await getListadoCostosFijosByRangeDateService(req);
      res.status(200).json({ message: 'Costos fijos obtenidos exitosamente', costos_fijos });
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function pagar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await pagarCostoFijo(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Costo fijo pagado exitosamente'});
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
  getListadoCostosFijosByRangeDate,
  pagar
};