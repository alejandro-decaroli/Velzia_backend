import costoVariableRepository from '../repositories/costoVariableRepository.js';
import { Request, Response } from 'express';

const costoVariableController = {
  async getAll(req: Request, res: Response) {
    const costosVariables = await costoVariableRepository.getAll();
    res.json(costosVariables);
  },

  async getById(req: Request, res: Response) {
    const costoVariable = await costoVariableRepository.getById(Number(req.params.id));
    if (!costoVariable) return res.status(404).json({ error: 'Costo variable no encontrado' });
    res.json(costoVariable);
  },

  async create(req: Request, res: Response) {
    const costoVariable = await costoVariableRepository.create(req.body);
    res.status(201).json(costoVariable);
  },

  async update(req: Request, res: Response) {
    const costoVariable = await costoVariableRepository.update(Number(req.params.id), req.body);
    res.json(costoVariable);
  },

  async remove(req: Request, res: Response) {
    await costoVariableRepository.remove(Number(req.params.id));
    res.status(204).send();
  }
};

export default costoVariableController;
