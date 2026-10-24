import { Request, Response } from 'express';
import { getAllMovimientos, getByIdMovimiento } from '../services/movimientoService.js';

async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { fecha, filtro, tipo, categoria }: any = req.query;
    const movimientos = await getAllMovimientos(
      Number(userId),
      fecha,
      filtro || tipo,
      categoria
    );
    res.status(200).json({
      message: 'Movimientos financieros obtenidos exitosamente',
      movimientos,
      historial_financiero: movimientos,
      movimientos_financieros: movimientos
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener los movimientos financieros' });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const movimiento = await getByIdMovimiento(Number(userId), Number(req.params.id));
    res.status(200).json({
      message: 'Movimiento financiero encontrado exitosamente',
      movimiento
    });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error interno' });
  }
}

export {
  getAll,
  getById
};
