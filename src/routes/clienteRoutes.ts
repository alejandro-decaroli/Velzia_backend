import express, { Request, Response } from 'express';
import clienteController from '../controllers/clienteController.js';
import { createClienteValidation, idParamValidation, handleValidationErrors } from '../middlewares/clienteValidations.js';

const clienteRouter = express.Router();

clienteRouter.get('/', (req: Request, res: Response) => {clienteController.getAll(req, res)});

clienteRouter.get('/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {clienteController.getById(req, res)}
);

clienteRouter.post('/create', 
  createClienteValidation, 
  (req: Request, res: Response) => {clienteController.create(req, res)}
);

clienteRouter.put('/update/:id', 
  idParamValidation,
  createClienteValidation, 
  (req: Request, res: Response) => {clienteController.update(req, res)}
);

clienteRouter.delete('/delete/:id', 
  idParamValidation, 
  (req: Request, res: Response) => {clienteController.remove(req, res)}
);

export default clienteRouter;