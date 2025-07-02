import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Transferencia } from '../entities/Transferencia.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const transferencias = await em.find(Transferencia, {});
      res.status(200).json({ message: 'Transferencias obtenidas exitosamente', transferencias });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las transferencias' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const transferencia = await em.findOne(Transferencia, id);
      if (!transferencia) {
        return res.status(404).json({ message: 'Transferencia no encontrada' });
      }

      res.status(200).json({ message: 'Transferencia encontrada exitosamente', transferencia });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener la transferencia', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const transferencia = em.create(Transferencia, req.body);
      await em.flush();
      res.status(201).json({ message: 'Transferencia creada exitosamente', transferencia });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la transferencia', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const transferencia = await em.findOne(Transferencia, id);
      if (!transferencia) {
        return res.status(404).json({ message: 'Transferencia no encontrada' });
      }

      transferencia.monto = req.body.monto;
      transferencia.caja_origen = req.body.caja_origen;
      transferencia.caja_destino = req.body.caja_destino;
      transferencia.moneda = req.body.moneda;
      await em.flush();
      res.status(201).json({ message: 'Transferencia actualizada exitosamente', transferencia });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar la transferencia', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const transferencia = await em.findOne(Transferencia, id);
      if (!transferencia) {
        return res.status(404).json({ message: 'Transferencia no encontrada' });
      }

      await em.removeAndFlush(transferencia);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la transferencia' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};