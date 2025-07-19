import { Request, Response } from 'express';
import { createPago, getAllPagos, getByIdPago, removePago, updatePago } from '../services/pagoService.js';

async function getAll(req: Request, res: Response) {
    try {
      const pagos = await getAllPagos();
      res.status(200).json({ message: 'Pagos obtenidos exitosamente', pagos });
    } catch (error:any) {
      res.status(500).json({ error: 'Error al obtener los pagos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const pago = await getByIdPago(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Pago encontrado exitosamente', pago });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el pago', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const pago = await createPago(req.body);
      res.status(201).json({ message: 'Pago creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const pago = await updatePago(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Pago actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    }
}

async function remove(req: Request, res: Response) {
    try {
      await removePago(req.body, Number(req.params.id));
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