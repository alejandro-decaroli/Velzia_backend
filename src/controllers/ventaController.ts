/* import ventaRepository from '../repositories/ventaRepository.js';
import { Request, Response } from 'express';

const ventaController = {
  async getAll(req: Request, res: Response) {
    try {
      const ventas = await ventaRepository.getAll();
      res.json(ventas);      
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas'});
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const venta = await ventaRepository.getById(id);
      if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

      res.json(venta);
    }
    catch(error) {
      res.status(500).json({ error: 'Error al obtener la venta' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const venta = await ventaRepository.create(req.body);
      res.status(201).json(venta);
    } catch(error) {
      res.status(500).json({ error: ' Error al crear la venta ' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const venta = await ventaRepository.update(id, req.body);
      if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

      res.json(venta);
    } catch(error) {
      res.status(500).json({ error: ' Error al actualizar la venta' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      
      const venta = await ventaRepository.remove(id);
      if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

      res.status(204).send();
    } catch(error) {
      res.status(500).json({ error: ' Error al eliminar la venta' });
    }
  }
};

export default ventaController; */