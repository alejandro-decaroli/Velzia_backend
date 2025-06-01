import clienteRepository from '../repositories/clienteRepository.js';
import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const clienteController = {
  async getAll(req: Request, res: Response) {
    try {
      const clientes = await clienteRepository.getAll();
      res.status(200).json({ message: 'Clientes obtenidos exitosamente', clientes });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const cliente = await clienteRepository.getById(id);
      if (!cliente) throw new NotFound('Cliente no encontrado');

      res.status(200).json({ message: 'Cliente encontrado exitosamente', cliente });
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al obtener el cliente' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const cliente = await clienteRepository.create(req.body);
      res.status(201).json({ message: 'Cliente creado exitosamente', cliente });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el cliente' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const cliente = await clienteRepository.update(id, req.body);
      res.status(200).json({ message: 'Cliente actualizado exitosamente', cliente });
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await clienteRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFound) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
  }
};

export default clienteController;
