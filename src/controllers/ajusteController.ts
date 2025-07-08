import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Caja } from '../entities/Caja.entities.js';


const em = orm.em;


async function getAll(req: Request, res: Response) {
    try {
      const ajustes = await em.find(Ajuste, {});
      res.status(200).json({ message: 'Ajustes obtenidos exitosamente', ajustes });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener los ajustes', error });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const ajuste = await em.findOne(Ajuste, id);
      if (!ajuste) {
        return res.status(404).json({ message: 'Ajuste no encontrado' });
      }
      res.status(200).json({ message: 'Ajuste obtenido exitosamente', ajuste });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el ajuste', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const moneda_id = Number(req.body.moneda);
      const caja_id = Number(req.body.caja);
      const moneda = await em.findOne(Moneda, moneda_id);
      const caja = await em.findOne(Caja, caja_id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(409).json({ message: 'Moneda de la caja no coincide con la moneda del ajuste' });
      }
      const ajuste = em.create(Ajuste, req.body);
      await em.flush();
      res.status(201).json({ message: 'Ajuste creado exitosamente', ajuste });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al crear el ajuste', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const ajuste = await em.findOne(Ajuste, id);
      if (!ajuste) {
        return res.status(404).json({ message: 'Ajuste no encontrado' });
      }
      const moneda_id = Number(req.body.moneda);
      const caja_id = Number(req.body.caja);
      const moneda = await em.findOne(Moneda, moneda_id);
      const caja = await em.findOne(Caja, caja_id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(409).json({ message: 'Moneda de la caja no coincide con la moneda del ajuste' });
      }
      ajuste.monto = req.body.monto;
      ajuste.movimiento = req.body.movimiento;
      ajuste.moneda = req.body.moneda;
      ajuste.caja = req.body.caja;
      await em.flush();
      res.status(201).json({ message: 'Ajuste actualizado exitosamente', ajuste });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el ajuste', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const ajuste = await em.findOne(Ajuste, id);
      if (!ajuste) {
        return res.status(404).json({ message: 'Ajuste no encontrado' });
      }
      await em.removeAndFlush(ajuste);
      res.status(204).send()
    } catch (error: any) {
      res.status(500).json({ message: 'Error al eliminar el ajuste', error });
    }
  }

export {
  getAll,
  getById,
  create,
  update,
  remove
}; 
