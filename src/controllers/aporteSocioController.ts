import aporteSocioRepository from '../repositories/aporteSocioRepository.js';
import { Request, Response } from 'express';

const aporteSocioController = {
  async getAll(req: Request, res: Response) {
    const aportesSocio = await aporteSocioRepository.getAll();
    res.json(aportesSocio);
  },

  async getById(req: Request, res: Response) {
    const aporteSocio = await aporteSocioRepository.getById(Number(req.params.id));
    if (!aporteSocio) return res.status(404).json({ error: 'Aporte socio no encontrado' });
    res.json(aporteSocio);
  },

  async create(req: Request, res: Response) {
    const aporteSocio = await aporteSocioRepository.create(req.body);
    res.status(201).json(aporteSocio);
  },

  async update(req: Request, res: Response) {
    const aporteSocio = await aporteSocioRepository.update(Number(req.params.id), req.body);
    res.json(aporteSocio);
  },

  async remove(req: Request, res: Response) {
    await aporteSocioRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default aporteSocioController;
