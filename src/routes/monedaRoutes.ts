import express, { Request, Response } from 'express';
import monedaController from '../controllers/monedaController.js';
import { handleValidationErrors, idParamValidation, monedaValidation } from '../middlewares/validations.js';

const monedaRouter = express.Router();

monedaRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {monedaController.getAll(req, res)}
);

monedaRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {monedaController.getById(req, res)}
);

monedaRouter.post('/create', 
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {monedaController.create(req, res)}
);

monedaRouter.put('/update/:id', 
  idParamValidation,
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {monedaController.update(req, res)}
);

monedaRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {monedaController.remove(req, res)}
);

export default monedaRouter;