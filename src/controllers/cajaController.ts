import { Request, Response } from 'express';
import { 
  createCaja, 
  getAllCajas, 
  getByIdCaja, 
  removeCaja, 
  updateCaja,
  realizarTransferencia,
  obtenerConciliacion,
  realizarConciliacion
} from '../services/cajaService.js';

async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const {fecha} : any = req.query;
      const cajas = await getAllCajas(Number(userId), fecha);
      res.status(200).json({ message: 'Cajas obtenidas exitosamente', cajas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las cajas' });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const caja = await getByIdCaja(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Caja encontrada exitosamente', caja });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await createCaja(req.body, Number(userId));
      res.status(201).json({ message: 'Caja creada exitosamente'});
    } catch (error:any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await updateCaja(req.body, Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Caja actualizada exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeCaja(Number(userId), Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function transferir(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const body = {
        ...req.body,
        caja_origen: req.body.caja_origen || req.params.id
      };
      const result = await realizarTransferencia(body, Number(userId));
      res.status(200).json({ 
        message: 'Transferencia realizada exitosamente', 
        ...result 
      });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error al realizar la transferencia' });
    }
}

async function getConciliacion(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const cajaId = req.params.id ? Number(req.params.id) : undefined;
      const resultado = await obtenerConciliacion(Number(userId), cajaId);
      res.status(200).json({ 
        message: 'Datos de conciliación obtenidos exitosamente', 
        conciliacion: resultado 
      });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error al obtener datos de conciliación' });
    }
}

async function conciliar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const cajaId = req.params.id ? Number(req.params.id) : undefined;
      const result = await realizarConciliacion(req.body, Number(userId), cajaId);
      res.status(200).json({ 
        message: 'Conciliación realizada exitosamente', 
        ...result 
      });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error al realizar la conciliación' });
    }
}

export {
  getAll,
  getById,
  create,
  update,
  remove,
  transferir,
  getConciliacion,
  conciliar
};