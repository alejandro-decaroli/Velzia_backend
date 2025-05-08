import tasaRepository from '../repositories/tasaRepository.js';
import { Request, Response } from 'express';

const tasaController = {
  async getAll(req: Request, res: Response) {
    const tasas = await tasaRepository.getAll();
    res.json(tasas);
  },

  async getById(req: Request, res: Response) {
    const tasa = await tasaRepository.getById(Number(req.params.id));
    if (!tasa) return res.status(404).json({ error: 'Tasa no encontrada' });
    res.json(tasa);
  },

  async create(req: Request, res: Response) {
    const tasa = await tasaRepository.create(req.body);
    res.status(201).json(tasa);
  },

  async update(req: Request, res: Response) {
    const tasa = await tasaRepository.update(Number(req.params.id), req.body);
    res.json(tasa);
  },

  async remove(req: Request, res: Response) {
    await tasaRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default tasaController;
