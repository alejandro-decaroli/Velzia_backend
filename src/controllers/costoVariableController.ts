/* import costoVariableRepository from '../repositories/costoVariableRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const costoVariableController = {
  async getAll(req: Request, res: Response) {
    try {
      const costosVariables = await costoVariableRepository.getAll();
      res.json(costosVariables);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener los costos variables' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const costoVariable = await costoVariableRepository.getById(id);
      res.json(costoVariable);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener el costo variable' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const costoVariable = await costoVariableRepository.create(req.body);
      res.status(201).json(costoVariable);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al crear el costo variable' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const costoVariable = await costoVariableRepository.update(id, req.body);
      res.json(costoVariable);
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el costo variable' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await costoVariableRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar el costo variable' });
    }
  }
};

export default costoVariableController;
 */