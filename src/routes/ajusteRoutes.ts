import express, { Request, Response } from 'express';
import ajusteController from '../controllers/ajusteController.js';
import { handleValidationErrors, idParamValidation, ajusteValidation } from '../middlewares/validations.js';

const ajusteRouter = express.Router();

ajusteRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {ajusteController.getAll(req, res)}
);

ajusteRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {ajusteController.getById(req, res)}
);

ajusteRouter.post('/create', 
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {ajusteController.create(req, res)}
);

ajusteRouter.put('/update/:id', 
  idParamValidation,
  ajusteValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {ajusteController.update(req, res)}
);

ajusteRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {ajusteController.remove(req, res)}
);

export default ajusteRouter;