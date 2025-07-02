import { Request, Response } from 'express';
import { Cliente } from '../entities/Cliente.entities.js';
import { orm } from '../db/orm.js';


const em = orm.em;

async function getAll(req: Request, res: Response) {
      try {
        const clientes = await em.find(Cliente, {});
        res.status(200).json({ message: 'Clientes obtenidos exitosamente', clientes });
      } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener los clientes', error });
      }
  }

async function getById(req: Request, res: Response) {
      try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido' });
        }

        const cliente = await em.findOne(Cliente, id);
        if (!cliente) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        await em.flush();
        res.status(200).json({ message: 'Cliente encontrado exitosamente', cliente });

      } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
      }
  }

async function create(req: Request, res: Response) {
      try {
        const cliente = em.create(Cliente, req.body);
        await em.flush();
        res.status(201).json({ message: 'Cliente creado exitosamente', cliente });
      } catch (error: any) {
        res.status(500).json({ message: 'Error al crear el cliente', error });
      }
  }

async function update(req: Request, res: Response) {
      try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido' });
        }
        const cliente = await em.findOne(Cliente, id);
        if (!cliente) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        cliente.nombre = req.body.nombre;
        cliente.siglas = req.body.siglas;
        await em.flush();
        res.status(201).json({ message: 'Cliente actualizado exitosamente', cliente });
      } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar el cliente', error });
      }
  }

async function remove(req: Request, res: Response) {
      try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido' });
        }
        const cliente = await em.findOne(Cliente, id);
        if (!cliente) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        await em.removeAndFlush(cliente);
        res.status(204).json({ message: 'Cliente eliminado exitosamente' });
      } catch (error: any) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error });
      }
    }

export {
  getAll,
  getById,
  create,
  update,
  remove
};

