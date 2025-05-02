import clienteRepository from '../repositories/clienteRepository.js';
import { Request, Response } from 'express';

const clienteController = {
  async getAll(req: Request, res: Response) {
    const clientes = await clienteRepository.getAll();
    res.json(clientes);
  },

  async getById(req: Request, res: Response) {
    const cliente = await clienteRepository.getById(Number(req.params.id));
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  },

  async create(req: Request, res: Response) {
    const cliente = await clienteRepository.create(req.body);
    res.status(201).json(cliente);
  },

  async update(req: Request, res: Response) {
    const cliente = await clienteRepository.update(Number(req.params.id), req.body);
    res.json(cliente);
  },

  async remove(req: Request, res: Response) {
    await clienteRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default clienteController;
