import pagoRepository from '../repositories/pagoRepository.js';
import { Request, Response } from 'express';

const pagoController = {
  async getAll(req: Request, res: Response) {
    const pagos = await pagoRepository.getAll();
    res.json(pagos);
  },

  async getById(req: Request, res: Response) {
    const pago = await pagoRepository.getById(Number(req.params.id));
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pago);
  },

  async create(req: Request, res: Response) {
    const pago = await pagoRepository.create(req.body);
    res.status(201).json(pago);
  },

  async update(req: Request, res: Response) {
    const pago = await pagoRepository.update(Number(req.params.id), req.body);
    res.json(pago);
  },

  async remove(req: Request, res: Response) {
    await pagoRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default pagoController;
