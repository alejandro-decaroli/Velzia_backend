import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, CajaValidation } from '../middlewares/validations.js';
import { getAll, getById, create, update, remove } from '../controllers/cajaController.js';
import { verifyToken } from '../middlewares/auth.js';

const cajaRouter = express.Router();

cajaRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

cajaRouter.get('/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

cajaRouter.post('/create',
  verifyToken,
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

cajaRouter.put('/update/:id', 
  verifyToken,
  idParamValidation, 
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

cajaRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default cajaRouter;
