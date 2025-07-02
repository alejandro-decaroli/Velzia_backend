import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Venta } from '../entities/Venta.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const ventas = await em.find(Venta, {});
      res.status(200).json({ message: 'Ventas obtenidas exitosamente', ventas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const venta = await em.findOne(Venta, id);
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }

      res.status(200).json({ message: 'Venta encontrada exitosamente', venta });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener la venta', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const venta = em.create(Venta, req.body);
      await em.flush();
      res.status(201).json({ message: 'Venta creada exitosamente', venta });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la venta', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const venta = await em.findOne(Venta, id);
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }

      venta.cliente = req.body.cliente;
      venta.monto_ars = req.body.monto_ars;
      venta.monto_usd = req.body.monto_usd;
      venta.costo_mano_obra = req.body.costo_mano_obra;
      venta.costo_materiales_viaticos_fletes = req.body.costo_materiales_viaticos_fletes;
      venta.costo_comision = req.body.costo_comision;
      venta.estado = req.body.estado;
      await em.flush();
      res.status(201).json({ message: 'Venta actualizada exitosamente', venta });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar la venta', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const venta = await em.findOne(Venta, id);
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }

      await em.removeAndFlush(venta);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la venta' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};