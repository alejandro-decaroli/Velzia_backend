import tasaRepository from '../repositories/tasaRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const tasaController = {
  async getAll(req: Request, res: Response) {
    try {
      const tasas = await tasaRepository.getAll();
      res.json(tasas);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener las tasas' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const tasa = await tasaRepository.getById(id);
      res.json(tasa);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener la tasa' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const tasa = await tasaRepository.create(req.body);
      res.status(201).json(tasa);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al crear' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const tasa = await tasaRepository.update(id, req.body);
      res.json(tasa);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar' });
    }
  },


  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await tasaRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};

export default tasaController;
