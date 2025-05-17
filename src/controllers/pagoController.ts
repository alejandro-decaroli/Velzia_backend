import pagoRepository from '../repositories/pagoRepository.js';
import { Request, Response } from 'express';

const pagoController = {
  async getAll(req: Request, res: Response) {
    const clientes = pagoRepository.getAll();
    res.json(clientes);
  },

  async getById(req: Request, res: Response) {
    const cliente = pagoRepository.getById(Number(req.params.id));
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  },

  async create(req: Request, res: Response) {
    const cliente = pagoRepository.create(req.body);
    res.status(201).json(cliente);
  },

  async update(req: Request, res: Response) {
    const cliente = pagoRepository.update(Number(req.params.id), req.body);
    res.json(cliente);
  },

  async remove(req: Request, res: Response) {
    pagoRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default pagoController;
