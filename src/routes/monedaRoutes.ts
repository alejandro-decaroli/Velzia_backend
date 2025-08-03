import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/monedaController.js';
import { handleValidationErrors, idParamValidation, monedaValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const monedaRouter = express.Router();

monedaRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

monedaRouter.get('/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

monedaRouter.post('/create', 
  verifyToken,
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

monedaRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  monedaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

monedaRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default monedaRouter;