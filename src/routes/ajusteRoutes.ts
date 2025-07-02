import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/ajusteController.js';
import { handleValidationErrors, idParamValidation, ajusteValidation } from '../middlewares/validations.js';

const ajusteRouter = express.Router();

ajusteRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

ajusteRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

ajusteRouter.post('/create', 
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

ajusteRouter.put('/update/:id', 
  idParamValidation,
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

ajusteRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default ajusteRouter;