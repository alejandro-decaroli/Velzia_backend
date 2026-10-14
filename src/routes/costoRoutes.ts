import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove, pagar } from '../controllers/costoController.js';
import { handleValidationErrors, idParamValidation, costoValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const costoRouter = express.Router();

costoRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getAll(req, res); }
);

costoRouter.get('/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getById(req, res); }
);

costoRouter.post('/create', 
  verifyToken,
  costoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => { create(req, res); }
);

costoRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  costoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => { update(req, res); }
);

costoRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { remove(req, res); }
);

costoRouter.post('/pagar/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { pagar(req, res); }
);

export default costoRouter;