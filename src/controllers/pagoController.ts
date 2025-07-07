import { Request, Response } from 'express';
import { orm } from '../db/orm.js';
import { Pago } from '../entities/Pago.entities.js';
import { Caja } from '../entities/Caja.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Venta } from '../entities/Venta.entities.js';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
      const pagos = await em.find(Pago, {});
      res.status(200).json({ message: 'Pagos obtenidos exitosamente', pagos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los pagos' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const pago = await em.findOne(Pago, id);
      if (!pago) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      res.status(200).json({ message: 'Pago encontrado exitosamente', pago });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener el pago', error });
    }
}

async function create(req: Request, res: Response) {
    try {
      const moneda = await em.findOne(Moneda, req.body.moneda);
      const caja = await em.findOne(Caja, req.body.caja);
      const venta = await em.findOne(Venta, req.body.venta);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(400).json({ message: 'Moneda de la caja no coincide con la moneda de la venta' });
      }
      if (moneda.id !== venta.moneda.id) {
        return res.status(400).json({ message: 'Moneda de la venta no coincide con la moneda de la venta' });
      }
      const pago = em.create(Pago, req.body);
      await em.flush();
      res.status(201).json({ message: 'Pago creado exitosamente', pago });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el pago', error });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const pago = await em.findOne(Pago, id);
      if (!pago) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }
      const moneda = await em.findOne(Moneda, req.body.moneda);
      const caja = await em.findOne(Caja, req.body.caja);
      const venta = await em.findOne(Venta, req.body.venta);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      if (!caja) {
        return res.status(404).json({ message: 'Caja no encontrada' });
      }
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      if (moneda.id !== caja.moneda.id) {
        return res.status(400).json({ message: 'Moneda de la caja no coincide con la moneda de la venta' });
      }
      if (moneda.id !== venta.moneda.id) {
        return res.status(400).json({ message: 'Moneda de la venta no coincide con la moneda de la venta' });
      }
      pago.monto = req.body.monto;
      pago.caja = caja;
      pago.moneda = moneda;
      pago.venta = venta;
      await em.flush();
      res.status(201).json({ message: 'Pago actualizado exitosamente', pago });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al actualizar el pago', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const pago = await em.findOne(Pago, id);
      if (!pago) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      await em.removeAndFlush(pago);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el pago' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove
};