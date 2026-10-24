import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';
import { getAll, getById } from '../controllers/movimientoController.js';

const movimientoRouter = express.Router();

movimientoRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getAll(req, res); }
);

movimientoRouter.get('/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getById(req, res); }
);

export default movimientoRouter;
