import { Request, Response } from 'express';
import {
  createPedido,
  getAllPedidos,
  getByIdPedido,
  removePedido,
  updatePedido,
  pagarPedido
} from '../services/pedidoService.js';
import { getLineasByPedido } from '../services/lineaPedidoService.js';

async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { estado, fecha }: any = req.query;
    const pedidos = await getAllPedidos(userId ? Number(userId) : undefined, estado, fecha);
    res.status(200).json({ message: 'Pedidos obtenidos exitosamente', pedidos });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al obtener los pedidos', error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const pedido = await getByIdPedido(Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Pedido encontrado exitosamente', pedido });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function create(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const pedido = await createPedido(req.body, userId ? Number(userId) : undefined);
    res.status(201).json({ message: 'Pedido creado exitosamente', pedido });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const pedido = await updatePedido(req.body, Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Pedido actualizado exitosamente', pedido });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    await removePedido(Number(userId), Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function getLineas(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.id);
    const lineas = await getLineasByPedido(pedidoId);
    res.status(200).json({ message: 'Líneas del pedido obtenidas exitosamente', lineas });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

async function pagar(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const pedido = await pagarPedido(req.body, Number(userId), Number(req.params.id));
    res.status(200).json({ message: 'Pedido pagado exitosamente', pedido });
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
  getLineas,
  pagar
};
