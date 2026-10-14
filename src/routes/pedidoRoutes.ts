import express, { Request, Response } from 'express';
import {
  handleValidationErrors,
  idParamValidation,
  pedidoValidation
} from '../middlewares/validations.js';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getLineas,
  pagar
} from '../controllers/pedidoController.js';
import { verifyToken } from '../middlewares/auth.js';

const pedidoRouter = express.Router();

pedidoRouter.get('/',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getAll(req, res); }
);

pedidoRouter.get('/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getById(req, res); }
);

pedidoRouter.get('/:id/lineas',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getLineas(req, res); }
);

pedidoRouter.post('/create',
  verifyToken,
  pedidoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { create(req, res); }
);

pedidoRouter.put('/update/:id',
  verifyToken,
  idParamValidation,
  pedidoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { update(req, res); }
);

pedidoRouter.delete('/delete/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { remove(req, res); }
);

pedidoRouter.post('/pagar/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { pagar(req, res); }
);

export default pedidoRouter;
