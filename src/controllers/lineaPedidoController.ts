import { Request, Response } from 'express';
import {
  createLineaPedido,
  getAllLineasPedido,
  getByIdLineaPedido,
  getLineasByPedido,
  removeLineaPedido,
  updateLineaPedido
} from '../services/lineaPedidoService.js';

async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { pedidoId }: any = req.query;
    const lineas = await getAllLineasPedido(
      userId ? Number(userId) : undefined,
      pedidoId ? Number(pedidoId) : undefined
    );
    res.status(200).json({ message: 'Líneas de pedido obtenidas exitosamente', lineas, lineas_pedidos: lineas });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al obtener las líneas de pedido', error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const linea = await getByIdLineaPedido(Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Línea de pedido encontrada exitosamente', linea, linea_pedido: linea });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function create(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    // Si pedido viene en params (ej: /pedidos/:id/lineas) o en body
    const data = {
      ...req.body,
      pedido: req.body.pedido || req.params.pedidoId
    };
    const linea = await createLineaPedido(data, userId ? Number(userId) : undefined);
    res.status(201).json({ message: 'Línea de pedido creada exitosamente', linea });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const linea = await updateLineaPedido(req.body, Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Línea de pedido actualizada exitosamente', linea });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await removeLineaPedido(Number(userId), Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function getByPedido(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const lineas = await getLineasByPedido(pedidoId);
    res.status(200).json({ message: 'Líneas del pedido obtenidas exitosamente', lineas });
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
  remove,
  getByPedido
};
