import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, CajaValidation } from '../middlewares/validations.js';
import { getAll, getById, create, update, remove } from '../controllers/cajaController.js';

const cajaRouter = express.Router();

cajaRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

cajaRouter.get('/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

cajaRouter.post('/create', 
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

cajaRouter.put('/update/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

cajaRouter.delete('/delete/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default cajaRouter;
