import costoFijoRepository from '../repositories/costoFijoRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const costoFijoController = {
  async getAll(req: Request, res: Response) {
    try {
      const costosFijos = await costoFijoRepository.getAll();
      res.json(costosFijos);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener los costos fijos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const costoFijo = await costoFijoRepository.getById(id);
      if (!costoFijo) throw new NotFound('Costo fijo no encontrado');

      res.json(costoFijo);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener el costo fijo' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const costoFijo = await costoFijoRepository.create(req.body);
      res.status(201).json(costoFijo);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al crear el costo fijo' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const costoFijo = await costoFijoRepository.update(id, req.body);
      res.json(costoFijo);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el costo fijo' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await costoFijoRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar el costo fijo' });
    }
  }
};
export default costoFijoController;
