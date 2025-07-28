import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove, getListadoCostosFijosByRangeDate } from '../controllers/costoFijoController.js';
import { handleValidationErrors, idParamValidation, costoFijoValidation } from '../middlewares/validations.js';

const costoFijoRouter = express.Router();

costoFijoRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

costoFijoRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

costoFijoRouter.post('/create', 
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

costoFijoRouter.put('/update/:id', 
  idParamValidation,
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

costoFijoRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);
costoFijoRouter.get('/listado/:fecha', 
  handleValidationErrors,
  (req: Request, res: Response) => {getListadoCostosFijosByRangeDate(req, res)}
);

export default costoFijoRouter;