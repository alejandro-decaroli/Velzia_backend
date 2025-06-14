import dividendoSocioRepository from '../repositories/dividendoSocioRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const dividendoSocioController = {
  async getAll(req: Request, res: Response) {
    try {
      const dividendoSocios = await dividendoSocioRepository.getAll();
      res.json(dividendoSocios);
    } catch(error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const dividendoSocio = await dividendoSocioRepository.getById(id);
      res.json(dividendoSocio);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener el dividendo' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const dividendoSocio = await dividendoSocioRepository.create(req.body);
      res.status(201).json(dividendoSocio);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al crear' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const dividendoSocio = await dividendoSocioRepository.update(id, req.body);
      res.json(dividendoSocio);
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

      await dividendoSocioRepository.remove(id);
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

export default dividendoSocioController;
