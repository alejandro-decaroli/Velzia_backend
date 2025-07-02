import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { CostoFijo } from '../entities/Costofijo.entities.js';
import { Caja } from '../entities/Caja.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const costosFijos = await em.find(CostoFijo, {});
      res.status(200).json({ message: 'Costos fijos obtenidos exitosamente', costosFijos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos fijos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoFijo = await em.findOne(CostoFijo, id);
      if (!costoFijo) {
        return res.status(404).json({ message: 'Costo fijo no encontrado' });
      }

      res.status(200).json({ message: 'Costo fijo encontrado exitosamente', costoFijo });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el costo fijo', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const costoFijo = em.create(CostoFijo, req.body);
      await em.flush();
      res.status(201).json({ message: 'Costo fijo creado exitosamente', costoFijo });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el costo fijo', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoFijo = await em.findOne(CostoFijo, id);
      if (!costoFijo) {
        return res.status(404).json({ message: 'Costo fijo no encontrado' });
      }
      costoFijo.adjudicacion = req.body.adjudicacion;
      costoFijo.caja = req.body.caja;
      costoFijo.monto = req.body.monto;
      costoFijo.moneda = req.body.moneda;
      await em.flush();
      res.status(201).json({ message: 'Costo fijo actualizado exitosamente', costoFijo });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el costo fijo', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoFijo = await em.findOne(CostoFijo, id);
      if (!costoFijo) {
        return res.status(404).json({ message: 'Costo fijo no encontrado' });
      }

      await em.removeAndFlush(costoFijo);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el costo fijo' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};