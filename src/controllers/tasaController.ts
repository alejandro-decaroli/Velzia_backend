import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Tasa } from '../entities/Tasa.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const tasas = await em.find(Tasa, {});
      res.status(200).json({ message: 'Tasas obtenidas exitosamente', tasas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las tasas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const tasa = await em.findOne(Tasa, id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa no encontrada' });
      }

      res.status(200).json({ message: 'Tasa encontrada exitosamente', tasa });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener la tasa', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const moneda_origen_id = Number(req.body.moneda_origen);
      const moneda_destino_id = Number(req.body.moneda_destino);
      const moneda_origen = await em.findOne(Moneda, moneda_origen_id);
      const moneda_destino = await em.findOne(Moneda, moneda_destino_id);
      if (!moneda_origen || !moneda_destino) {
        return res.status(404).json({ message: 'Moneda de origen o destino no encontrada' });
      }
      if (moneda_origen_id === moneda_destino_id) {
        return res.status(400).json({ message: 'Moneda de origen y destino no pueden ser la misma' });
      }
      const tasa = em.create(Tasa, req.body);
      await em.flush();
      res.status(201).json({ message: 'Tasa creada exitosamente', tasa });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la tasa', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const tasa = await em.findOne(Tasa, id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa no encontrada' });
      }
      const moneda_origen_id = Number(req.body.moneda_origen);
      const moneda_destino_id = Number(req.body.moneda_destino);
      const moneda_origen = await em.findOne(Moneda, moneda_origen_id);
      const moneda_destino = await em.findOne(Moneda, moneda_destino_id);
      if (!moneda_origen || !moneda_destino) {
        return res.status(404).json({ message: 'Moneda de origen o destino no encontrada' });
      }
      if (moneda_origen_id === moneda_destino_id) {
        return res.status(400).json({ message: 'Moneda de origen y destino no pueden ser la misma' });
      }
      tasa.tasa = req.body.tasa;
      tasa.moneda_origen = moneda_origen;
      tasa.moneda_destino = moneda_destino;
      await em.flush();
      res.status(201).json({ message: 'Tasa actualizada exitosamente', tasa });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar la tasa', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const tasa = await em.findOne(Tasa, id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa no encontrada' });
      }

      await em.removeAndFlush(tasa);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la tasa' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};