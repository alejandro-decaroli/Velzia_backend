import { Request, Response } from 'express';
import { createDividendoSocio, getAllDividendoSocio, getByIdDividendoSocio, removeDividendoSocio, updateDividendoSocio } from '../services/dividendoSocioService.js';

async function getAll(req: Request, res: Response) {
    try {
      const dividendoSocio = await getAllDividendoSocio();
      res.status(200).json({ message: 'dividendoSocios obtenidos exitosamente', dividendoSocio });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los dividendoSocios' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const dividendoSocio = await getByIdDividendoSocio(req.body, Number(req.params.id));
      res.status(200).json({ message: 'dividendoSocio encontrado exitosamente', dividendoSocio });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const dividendoSocio = await createDividendoSocio(req.body);
      res.status(201).json({ message: 'dividendoSocio creado exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const dividendoSocio = await updateDividendoSocio(req.body, Number(req.params.id));
      res.status(201).json({ message: 'dividendoSocio actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      await removeDividendoSocio(req.body, Number(req.params.id))
      res.status(204).send();
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