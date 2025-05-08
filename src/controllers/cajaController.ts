import cajaRepository from '../repositories/cajaRepository.js';
import { Request, Response } from 'express';

const cajaController = {
  async getAll(req: Request, res: Response) {
    const cajas = await cajaRepository.getAll();
    res.json(cajas);
  },

  async getById(req: Request, res: Response) {
    const caja = await cajaRepository.getById(Number(req.params.id));
    if (!caja) return res.status(404).json({ error: 'Caja no encontrada' });
    res.json(caja);
  },

  async create(req: Request, res: Response) {
    const caja = await cajaRepository.create(req.body);
    res.status(201).json(caja);
  },

  async update(req: Request, res: Response) {
    const caja = await cajaRepository.update(Number(req.params.id), req.body);
    res.json(caja);
  },

  async remove(req: Request, res: Response) {
    await cajaRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default cajaController;
