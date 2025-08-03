import express, { Request, Response, Router } from 'express';
import { handleValidationErrors, idParamValidation, ClienteValidation } from '../middlewares/validations.js';
import { getAll, getById, create, update, remove } from '../controllers/clienteController.js';
import { verifyToken } from '../middlewares/auth.js';

const clienteRouter = express.Router();

clienteRouter.get('/', (req: Request, res: Response) => {getAll(req, res)});

clienteRouter.get('/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

clienteRouter.post('/create', 
  verifyToken,
  ClienteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

clienteRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  ClienteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

clienteRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default clienteRouter;