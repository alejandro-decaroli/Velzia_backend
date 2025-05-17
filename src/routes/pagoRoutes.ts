import express, { Request, Response } from 'express';
import pagoController from '../controllers/pagoController.js';
import { handleValidationErrors, idParamValidation, PagoValidation } from '../middlewares/validations.js';

const pagoRouter = express.Router();

pagoRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {pagoController.getAll(req, res)}
);

pagoRouter.get('/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {pagoController.getById(req, res)}
);

pagoRouter.post('/create', 
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {pagoController.create(req, res)}
);
pagoRouter.put('/update/:id', 
  idParamValidation,
  PagoValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {pagoController.update(req, res)}
);
pagoRouter.delete('/delete/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {pagoController.remove(req, res)}
);

export default pagoRouter;