/* import cajaRepository from '../repositories/cajaRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const cajaController = {
  async getAll(req: Request, res: Response) {
    try {
      const cajas = await cajaRepository.getAll();
      res.status(200).json({ message: 'Cajas obtenidas exitosamente', cajas });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const caja = await cajaRepository.getById(Number(req.params.id));
      res.status(200).json({ message: 'Caja obtenida exitosamente', caja });
    } catch (error: any) {
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const caja = await cajaRepository.create(req.body);
      res.status(201).json({ message: 'Caja creada exitosamente', caja });
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
      const caja = await cajaRepository.update(Number(req.params.id), req.body);
      res.status(201).json({ message: 'Caja actualizada exitosamente', caja });
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
      await cajaRepository.remove(Number(req.params.id));
      res.status(200).json({ message: 'Caja eliminada exitosamente' });
    } catch (error: any) {
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
};

export default cajaController;
 */