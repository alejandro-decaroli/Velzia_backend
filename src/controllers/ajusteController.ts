import ajusteRepository from '../repositories/ajusteRepository.js';
import { Request, Response } from 'express';

const ajusteController = {
  async getAll(req: Request, res: Response) {
    try {
      const ajustes = await ajusteRepository.getAll();
      res.status(200).json({ message: 'Ajustes obtenidos exitosamente', ajustes });
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const ajuste = await ajusteRepository.getById(Number(req.params.id));
      res.status(200).json({ message: 'Ajuste obtenido exitosamente', ajuste });
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      throw error;
    }
  },

  async create(req: Request, res: Response) {
    try {
      const ajuste = await ajusteRepository.create(req.body);
      res.status(201).json({ message: 'Ajuste creado exitosamente', ajuste });
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }
  },

  async update(req: Request, res: Response) {
    try {
      const ajuste = await ajusteRepository.update(Number(req.params.id), req.body);
      res.status(200).json({ message: 'Ajuste actualizado exitosamente', ajuste });
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await ajusteRepository.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      throw error;
    }
  }
};

export default ajusteController;
