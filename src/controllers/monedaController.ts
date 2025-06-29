/* import monedaRepository from '../repositories/monedaRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const monedaController = {
  async getAll(req: Request, res: Response) {
    try {
      const monedas = await monedaRepository.getAll();
      res.status(200).json({ message: 'Monedas obtenidas exitosamente', monedas });
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

  async getById(req: Request, res: Response) {
    try {
      const moneda = await monedaRepository.getById(Number(req.params.id));
      res.status(200).json({ message: 'Moneda obtenida exitosamente', moneda });
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

  async create(req: Request, res: Response) {
    try {
      const moneda = await monedaRepository.create(req.body);
      res.status(201).json({ message: 'Moneda creada exitosamente', moneda });
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
      const moneda = await monedaRepository.update(Number(req.params.id), req.body);
      res.status(201).json({ message: 'Moneda actualizada exitosamente', moneda });
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
    try {
      await monedaRepository.remove(Number(req.params.id));
      res.status(200).json({ message: 'Moneda eliminada exitosamente' });
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
};

export default monedaController; */