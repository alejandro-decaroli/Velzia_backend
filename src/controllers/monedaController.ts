import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Moneda } from '../entities/Moneda.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const monedas = await em.find(Moneda, {});
      res.status(200).json({ message: 'Monedas obtenidas exitosamente', monedas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las monedas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const moneda = await em.findOne(Moneda, id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }

      res.status(200).json({ message: 'Moneda encontrada exitosamente', moneda });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener la moneda', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const moneda = em.create(Moneda, req.body);
      await em.flush();
      res.status(201).json({ message: 'Moneda creada exitosamente', moneda });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la moneda', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const moneda = await em.findOne(Moneda, id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }

      moneda.nombre = req.body.nombre;
      moneda.codigo_iso = req.body.codigo_iso;
      await em.flush();
      res.status(201).json({ message: 'Moneda actualizada exitosamente', moneda });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar la moneda', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const moneda = await em.findOne(Moneda, id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }

      await em.removeAndFlush(moneda);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la moneda' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};