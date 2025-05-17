import express, { Request, Response } from 'express';
import costoFijoController from '../controllers/costoFijoController.js';
import { handleValidationErrors, idParamValidation, costoFijoValidation } from '../middlewares/validations.js';

const costoFijoRouter = express.Router();

costoFijoRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {costoFijoController.getAll(req, res)}
);

costoFijoRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {costoFijoController.getById(req, res)}
);

costoFijoRouter.post('/create', 
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {costoFijoController.create(req, res)}
);

costoFijoRouter.put('/update/:id', 
  idParamValidation,
  costoFijoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {costoFijoController.update(req, res)}
);

costoFijoRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {costoFijoController.remove(req, res)}
);

export default costoFijoRouter;