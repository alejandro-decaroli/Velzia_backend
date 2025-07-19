import { Request, Response } from 'express';
import { createVenta, getAllVentas, getByIdVenta, removeVenta, updateVenta } from '../services/ventaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const ventas = await getAllVentas();
      res.status(200).json({ message: 'Ventas obtenidas exitosamente', ventas });
    } catch (error:any) {
      res.status(500).json({ error: 'Error al obtener las ventas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const venta = await getByIdVenta(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Venta encontrada exitosamente', venta });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    }
}

async function create(req: Request, res: Response) {
    try {
      const venta = await createVenta(req.body);
      res.status(201).json({ message: 'Venta creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    }
}

async function update(req: Request, res: Response) {
    try {
      const venta = await updateVenta(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Venta actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    }
}

async function remove(req: Request, res: Response) {
    try {
      const venta = await removeVenta(req.body, Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};