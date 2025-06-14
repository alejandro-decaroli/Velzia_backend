import aporteSocioRepository from '../repositories/aporteSocioRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const aporteSocioController = {
  async getAll(req: Request, res: Response) {
    try {
      const aportesSocio = await aporteSocioRepository.getAll();
      res.json(aportesSocio);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los aportes de socios' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const aporteSocio = await aporteSocioRepository.getById(id);
      if (!aporteSocio) throw new NotFound('Aporte socio no encontrado');

      res.json(aporteSocio);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener el aporte de socio' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const aporteSocio = await aporteSocioRepository.create(req.body);
      res.status(201).json(aporteSocio);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el aporte de socio' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const aporteSocio = await aporteSocioRepository.update(id, req.body);
      res.json(aporteSocio);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el aporte de socio' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await aporteSocioRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar el aporte de socio' });
    }
  }
};

export default aporteSocioController;
