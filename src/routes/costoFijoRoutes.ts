import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove, getListadoCostosFijosByRangeDate } from '../controllers/costoFijoController.js';
import { handleValidationErrors, idParamValidation, costoFijoValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const costoFijoRouter = express.Router();

costoFijoRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

costoFijoRouter.get('/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

costoFijoRouter.post('/create', 
  verifyToken,
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

costoFijoRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

costoFijoRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);
costoFijoRouter.get('/listado/:fecha', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getListadoCostosFijosByRangeDate(req, res)}
);

export default costoFijoRouter;