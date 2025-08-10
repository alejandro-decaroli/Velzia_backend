import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/ajusteController.js';
import { handleValidationErrors, idParamValidation, ajusteValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const ajusteRouter = express.Router();

ajusteRouter.get('/',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

ajusteRouter.get('/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

ajusteRouter.post('/create', 
  verifyToken,
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

ajusteRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

ajusteRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default ajusteRouter;