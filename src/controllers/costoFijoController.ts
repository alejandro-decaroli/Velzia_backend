import costoFijoRepository from '../repositories/costoFijoRepository.js';
import { Request, Response } from 'express';

const costoFijoController = {
  async getAll(req: Request, res: Response) {
    const costosFijos = await costoFijoRepository.getAll();
    res.json(costosFijos);
  },

  async getById(req: Request, res: Response) {
    const costoFijo = await costoFijoRepository.getById(Number(req.params.id));
    if (!costoFijo) return res.status(404).json({ error: 'Costo fijo no encontrado' });
    res.json(costoFijo);
  },

  async create(req: Request, res: Response) {
    const costoFijo = await costoFijoRepository.create(req.body);
    res.status(201).json(costoFijo);
  },

  async update(req: Request, res: Response) {
    const costoFijo = await costoFijoRepository.update(Number(req.params.id), req.body);
    res.json(costoFijo);
  },

  async remove(req: Request, res: Response) {
    await costoFijoRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default costoFijoController;
