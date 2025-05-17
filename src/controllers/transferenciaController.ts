import transferenciaRepository from '../repositories/transferenciaRepository.js';
import { Request, Response } from 'express';

const transferenciaController = {
  async getAll(req: Request, res: Response) {
    const transferencias = await transferenciaRepository.getAll();
    res.json(transferencias);
  },

  async getById(req: Request, res: Response) {
    const transferencia = await transferenciaRepository.getById(Number(req.params.id));
    if (!transferencia) return res.status(404).json({ error: 'Transferencia no encontrada' });
    res.json(transferencia);
  },

  async create(req: Request, res: Response) {
    const transferencia = await transferenciaRepository.create(req.body);
    res.status(201).json(transferencia);
  },

  async update(req: Request, res: Response) {
    const transferencia = await transferenciaRepository.update(Number(req.params.id), req.body);
    res.json(transferencia);
  },

  async remove(req: Request, res: Response) {
    await transferenciaRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default transferenciaController;
