import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/pagoController.js';
import { handleValidationErrors, idParamValidation, PagoValidation } from '../middlewares/validations.js';

const pagoRouter = express.Router();

pagoRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

pagoRouter.get('/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

pagoRouter.post('/create', 
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);
pagoRouter.put('/update/:id', 
  idParamValidation,
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);
pagoRouter.delete('/delete/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default pagoRouter;