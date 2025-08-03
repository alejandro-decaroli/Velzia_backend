import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/pagoController.js';
import { handleValidationErrors, idParamValidation, PagoValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const pagoRouter = express.Router();

pagoRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

pagoRouter.get('/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

pagoRouter.post('/create', 
  verifyToken,
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);
pagoRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);
pagoRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default pagoRouter;