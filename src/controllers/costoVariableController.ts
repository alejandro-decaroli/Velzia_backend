import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { CostoVariable } from '../entities/Costovariable.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const costosVariables = await em.find(CostoVariable, {});
      res.status(200).json({ message: 'Costos variables obtenidos exitosamente', costosVariables });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los costos variables' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoVariable = await em.findOne(CostoVariable, id);
      if (!costoVariable) {
        return res.status(404).json({ message: 'Costo variable no encontrado' });
      }

      res.status(200).json({ message: 'Costo variable encontrado exitosamente', costoVariable });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el costo variable', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const costoVariable = em.create(CostoVariable, req.body);
      await em.flush();
      res.status(201).json({ message: 'Costo variable creado exitosamente', costoVariable });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el costo variable', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoVariable = await em.findOne(CostoVariable, id);
      if (!costoVariable) {
        return res.status(404).json({ message: 'Costo variable no encontrado' });
      }

      costoVariable.monto = req.body.monto;
      costoVariable.adjudicacion = req.body.adjudicacion;
      costoVariable.caja = req.body.caja;
      costoVariable.venta = req.body.venta;
      costoVariable.moneda = req.body.moneda;
      await em.flush();
      res.status(201).json({ message: 'Costo variable actualizado exitosamente', costoVariable });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el costo variable', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const costoVariable = await em.findOne(CostoVariable, id);
      if (!costoVariable) {
        return res.status(404).json({ message: 'Costo variable no encontrado' });
      }

      await em.removeAndFlush(costoVariable);
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