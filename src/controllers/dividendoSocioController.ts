import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Dividendo } from '../entities/Dividendo.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const dividendos = await em.find(Dividendo, {});
      res.status(200).json({ message: 'Dividendos obtenidos exitosamente', dividendos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los dividendos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const dividendo = await em.findOne(Dividendo, id);
      if (!dividendo) {
        return res.status(404).json({ message: 'Dividendo no encontrado' });
      }

      res.status(200).json({ message: 'Dividendo encontrado exitosamente', dividendo });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el dividendo', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const dividendo = em.create(Dividendo, req.body);
      await em.flush();
      res.status(201).json({ message: 'Dividendo creado exitosamente', dividendo });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el dividendo', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const dividendo = await em.findOne(Dividendo, id);
      if (!dividendo) {
        return res.status(404).json({ message: 'Dividendo no encontrado' });
      }

      dividendo.dividendo = req.body.dividendo;
      dividendo.monto = req.body.monto;
      dividendo.moneda = req.body.moneda;
      dividendo.caja = req.body.caja;
      await em.flush();
      res.status(201).json({ message: 'Dividendo actualizado exitosamente', dividendo });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el dividendo', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const dividendo = await em.findOne(Dividendo, id);
      if (!dividendo) {
        return res.status(404).json({ message: 'Dividendo no encontrado' });
      }

      await em.removeAndFlush(dividendo);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el dividendo' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};