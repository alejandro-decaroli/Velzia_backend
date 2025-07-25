import { Request, Response } from 'express';
import { createTransferencia, getAllTransferencias, getByIdTransferencia, removeTransferencia, updateTransferencia } from '../services/transferenciaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const transferencias = await getAllTransferencias();
      res.status(200).json({ message: 'Transferencias obtenidas exitosamente', transferencias });
    } catch (error:any) {
      res.status(500).json({ error: 'Error al obtener las transferencias' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const transferencia = await getByIdTransferencia(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Transferencia encontrada exitosamente', transferencia });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    
    }
}

async function create(req: Request, res: Response) {
    try {
      const transferencia = await createTransferencia(req.body);
      res.status(201).json({ message: 'Transferencia creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const transferencia = await updateTransferencia(req.body, Number(req.params.id));
      res.status(201).json({ message: 'Transferencia actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });    
    }
}

async function remove(req: Request, res: Response) {
    try {
      const transferencia = await removeTransferencia(req.body, Number(req.params.id));
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