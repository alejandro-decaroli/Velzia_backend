import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const cajas = await em.find(Caja, {});
      res.status(200).json({ message: 'Cajas obtenidas exitosamente', cajas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las cajas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const caja = await em.findOne(Caja, id);
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }

      res.status(200).json({ message: 'Caja encontrada exitosamente', caja });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener la caja', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const caja = em.create(Caja, req.body);
      await em.flush();
      res.status(201).json({ message: 'Caja creada exitosamente', caja });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la caja', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const caja = await em.findOne(Caja, id);
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }

      caja.monto = req.body.monto;
      caja.nombre = req.body.nombre;
      caja.siglas = req.body.siglas;
      caja.moneda = req.body.moneda;
      await em.flush();
      res.status(201).json({ message: 'Caja actualizada exitosamente', caja });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar la caja', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const caja = await em.findOne(Caja, id);
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }

      await em.removeAndFlush(caja);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la caja' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};