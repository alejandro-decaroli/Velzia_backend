import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/monedaController.js';
import { handleValidationErrors, idParamValidation, monedaValidation } from '../middlewares/validations.js';

const monedaRouter = express.Router();

monedaRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

monedaRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

monedaRouter.post('/create', 
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

monedaRouter.put('/update/:id', 
  idParamValidation,
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

monedaRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default monedaRouter;