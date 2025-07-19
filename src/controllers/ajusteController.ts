import { Request, Response } from 'express';
import { createAjuste, getAllAjustes, getByIdAjuste, updateAjuste, removeAjuste } from '../services/ajusteService.js'

async function getAll(req: Request, res: Response) {
    try {
      const ajustes = await getAllAjustes();
      res.status(200).json({ message: 'Ajustes obtenidos exitosamente', ajustes });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener los ajustes', error });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const ajuste = await getByIdAjuste(req.body, Number(req.params.id));
      res.status(200).json({ message: 'Ajuste obtenido exitosamente', ajuste });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const ajuste = await createAjuste(req.body);
      res.status(201).json({ message: 'Ajuste creado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const ajuste = await updateAjuste(req.body, Number(req.params.id))
      res.status(201).json({ message: 'Ajuste actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const ajuste = await removeAjuste(req.body, Number(req.params.id));
      res.status(204).send()
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
  }

export {
  getAll,
  getById,
  create,
  update,
  remove
}; 
