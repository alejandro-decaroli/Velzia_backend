import transferenciaRepository from '../repositories/transferenciaRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const transferenciaController = {
  async getAll(req: Request, res: Response) {
    try {
      const transferencias = await transferenciaRepository.getAll();
      res.json(transferencias);
    } catch(error) {
      res.status(500).json({ error: 'Error al obtener las transferencias' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if(isNaN(id)) {
        throw new BadRequest('ID inválido');
      }

      const transferencia = await transferenciaRepository.getById(id);
      if (!transferencia) {
        throw new NotFound('Transferencia no encontrada');
      }
      res.json(transferencia);
    } catch(error) {
      	if (error instanceof BadRequest) {
          return res.status(400).json({ error: error.message });
        }
        if (error instanceof NotFound) {
          return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al buscar transferencia' });
    }
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
      return res.status(500).json({ error: 'Error al crear la transferencia' });
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
      return res.status(500).json({ error: 'Error al actualizar' });
    }
  },

  async remove(req: Request, res: Response) {
    try{
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequest('ID inválido');
      }
      await transferenciaRepository.remove(id);
      res.status(204).send();
    } catch(error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }      
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};

export default transferenciaController;
