import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Aporte } from '../entities/Aporte.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Caja } from '../entities/Caja.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const aportesSocio = await em.find(Aporte, {});
      res.status(200).json({ message: 'Aportes de socios obtenidos exitosamente', aportesSocio });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los aportes de socios' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const moneda = await em.findOne(Moneda, req.body.moneda);
      const caja = await em.findOne(Caja, req.body.caja);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(409).json({ message: 'Moneda de la caja no coincide con la moneda del aporte de socio' });
      }
      const aporteSocio = await em.findOne(Aporte, id);
      if (!aporteSocio) {
        return res.status(404).json({ message: 'Aporte socio no encontrado' });
      }

      res.status(200).json({ message: 'Aporte socio encontrado exitosamente', aporteSocio });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el aporte de socio', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const aporteSocio = em.create(Aporte, req.body);
      await em.flush();
      res.status(201).json({ message: 'Aporte socio creado exitosamente', aporteSocio });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el aporte de socio', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const moneda = await em.findOne(Moneda, req.body.moneda);
      const caja = await em.findOne(Caja, req.body.caja);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(409).json({ message: 'Moneda de la caja no coincide con la moneda del aporte de socio' });
      }
      const aporteSocio = await em.findOne(Aporte, id);
      if (!aporteSocio) {
        return res.status(404).json({ message: 'Aporte socio no encontrado' });
      }

      aporteSocio.monto = req.body.monto;
      aporteSocio.moneda = req.body.moneda;
      aporteSocio.caja = req.body.caja;
      await em.flush();
      res.status(201).json({ message: 'Aporte socio actualizado exitosamente', aporteSocio });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el aporte de socio', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const aporteSocio = await em.findOne(Aporte, id);
      if (!aporteSocio) {
        return res.status(404).json({ message: 'Aporte socio no encontrado' });
      }

      await em.removeAndFlush(aporteSocio);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el aporte de socio' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};
