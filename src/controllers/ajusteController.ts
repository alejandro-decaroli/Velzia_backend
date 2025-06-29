/* import { Request, Response } from 'express';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const ajusteController = {
  async getAll(req: Request, res: Response) {
    try {
      const ajustes = await ajusteRepository.getAll();
      res.status(200).json({ message: 'Ajustes obtenidos exitosamente', ajustes });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los ajustes' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const ajuste = await ajusteRepository.getById(id);
      if (!ajuste) throw new NotFound('Ajuste no encontrado');

      res.status(200).json({ message: 'Ajuste obtenido exitosamente', ajuste });
    } catch (error: any) {
      if (error instanceof BadRequest) return res.status(400).json({ error: error.message });
      if (error instanceof NotFound) return res.status(404).json({ error: error.message });
      res.status(500).json({ error: 'Error al obtener el ajuste' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const ajuste = await ajusteRepository.create(req.body);
      res.status(201).json({ message: 'Ajuste creado exitosamente', ajuste });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el ajuste' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      const ajuste = await ajusteRepository.update(id, req.body);
      res.status(200).json({ message: 'Ajuste actualizado exitosamente', ajuste });
    } catch (error: any) {
      if (error instanceof BadRequest) return res.status(400).json({ error: error.message });
      if (error instanceof NotFound) return res.status(404).json({ error: error.message });
      res.status(500).json({ error: 'Error al actualizar el ajuste' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequest('ID inválido');

      await ajusteRepository.remove(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof BadRequest) return res.status(400).json({ error: error.message });
      if (error instanceof NotFound) return res.status(404).json({ error: error.message });
      res.status(500).json({ error: 'Error al eliminar el ajuste' });
    }
  }
};

export default ajusteController; */
