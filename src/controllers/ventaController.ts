import ventaRepository from '../repositories/ventaRepository.js';
import { Request, Response } from 'express';

const ventaController = {
  async getAll(req: Request, res: Response) {
    const ventas = await ventaRepository.getAll();
    res.json(ventas);
  },

  async getById(req: Request, res: Response) {
    const venta = await ventaRepository.getById(Number(req.params.id));
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  },

  async create(req: Request, res: Response) {
    const venta = await ventaRepository.create(req.body);
    res.status(201).json(venta);
  },

  async update(req: Request, res: Response) {
    const venta = await ventaRepository.update(Number(req.params.id), req.body);
    res.json(venta);
  },

  async remove(req: Request, res: Response) {
    await ventaRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default ventaController;
