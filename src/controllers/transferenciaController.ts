import transferenciaRepository from '../repositories/transferenciaRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const transferenciaController = {
  async getAll(req: Request, res: Response) {
    const transferencias = await transferenciaRepository.getAll();
    res.json(transferencias);
  },

  async getById(req: Request, res: Response) {
    const transferencia = await transferenciaRepository.getById(Number(req.params.id));
    if (!transferencia) {
      throw new NotFound('Transferencia no encontrada');
    }
    res.json(transferencia);
  },

  async create(req: Request, res: Response) {
    try {
      const transferencia = await transferenciaRepository.create(req.body);
      res.status(201).json(transferencia);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const transferencia = await transferenciaRepository.update(Number(req.params.id), req.body);
      res.json(transferencia);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
        await transferenciaRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default transferenciaController;
