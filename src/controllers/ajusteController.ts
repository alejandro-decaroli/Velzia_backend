import ajusteRepository from '../repositories/ajusteRepository.js';
import { Request, Response } from 'express';

const ajusteController = {
  async getAll(req: Request, res: Response) {
    const ajustes = await ajusteRepository.getAll();
    res.json(ajustes);
  },

  async getById(req: Request, res: Response) {
    const ajuste = await ajusteRepository.getById(Number(req.params.id));
    if (!ajuste) return res.status(404).json({ error: 'Ajuste no encontrado' });
    res.json(ajuste);
  },

  async create(req: Request, res: Response) {
    const ajuste = await ajusteRepository.create(req.body);
    res.status(201).json(ajuste);
  },

  async update(req: Request, res: Response) {
    const ajuste = await ajusteRepository.update(Number(req.params.id), req.body);
    res.json(ajuste);
  },

  async remove(req: Request, res: Response) {
    await ajusteRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default ajusteController;
