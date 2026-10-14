import express, { Request, Response } from 'express';
import {
  handleValidationErrors,
  idParamValidation,
  lineaPedidoValidation
} from '../middlewares/validations.js';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getByPedido
} from '../controllers/lineaPedidoController.js';
import { verifyToken } from '../middlewares/auth.js';

const lineaPedidoRouter = express.Router();

lineaPedidoRouter.get('/',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getAll(req, res); }
);

lineaPedidoRouter.get('/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getById(req, res); }
);

lineaPedidoRouter.get('/pedido/:pedidoId',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getByPedido(req, res); }
);

lineaPedidoRouter.post('/create',
  verifyToken,
  lineaPedidoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { create(req, res); }
);

lineaPedidoRouter.put('/update/:id',
  verifyToken,
  idParamValidation,
  lineaPedidoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { update(req, res); }
);

lineaPedidoRouter.delete('/delete/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { remove(req, res); }
);

export default lineaPedidoRouter;
