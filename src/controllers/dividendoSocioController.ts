import dividendoSocioRepository from '../repositories/dividendoSocioRepository.js';
import { Request, Response } from 'express';

const dividendoSocioController = {
  async getAll(req: Request, res: Response) {
    const dividendoSocios = await dividendoSocioRepository.getAll();
    res.json(dividendoSocios);
  },

  async getById(req: Request, res: Response) {
    const dividendoSocio = await dividendoSocioRepository.getById(Number(req.params.id));
    if (!dividendoSocio) return res.status(404).json({ error: 'Dividendo socio no encontrado' });
    res.json(dividendoSocio);
  },

  async create(req: Request, res: Response) {
    const dividendoSocio = await dividendoSocioRepository.create(req.body);
    res.status(201).json(dividendoSocio);
  },

  async update(req: Request, res: Response) {
    const dividendoSocio = await dividendoSocioRepository.update(Number(req.params.id), req.body);
    res.json(dividendoSocio);
  },

  async remove(req: Request, res: Response) {
    await dividendoSocioRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default dividendoSocioController;
