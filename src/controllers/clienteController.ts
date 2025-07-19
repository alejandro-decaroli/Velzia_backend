import { Request, Response } from 'express';
import { createCliente, getAllClientes, getByIdCliente, removeCliente, updateCliente } from '../services/clienteService.js';

async function getAll(req: Request, res: Response) {
  try {
    const clientes = await getAllClientes();
    res.status(200).json({ message: 'Clientes obtenidos exitosamente', clientes });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const cliente = await getByIdCliente(req.body, Number(req.params.id));
    res.status(200).json({ message: 'Cliente encontrado exitosamente', cliente });

  } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function create(req: Request, res: Response) {
      try { 
        const cliente = await createCliente(req.body);
        res.status(201).json({ message: 'Cliente creado exitosamente'});
      } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
      }
  }

async function update(req: Request, res: Response) {
      try {
        const cliente = await updateCliente(req.body, Number(req.params.id));
        res.status(201).json({ message: 'Cliente actualizado exitosamente'});
      } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
      }
  }

async function remove(req: Request, res: Response) {
      try {
        await removeCliente(req.body, Number(req.params.id));
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
