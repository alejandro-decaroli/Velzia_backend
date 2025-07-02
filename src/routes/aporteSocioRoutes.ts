import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, aporteDividendoSocioValidation } from '../middlewares/validations.js';
import { create, getAll, getById, update, remove } from '../controllers/aporteSocioController.js';

const aporteSocioRouter = express.Router();

aporteSocioRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

aporteSocioRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

aporteSocioRouter.post('/create', 
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

aporteSocioRouter.put('/update/:id', 
  idParamValidation,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

aporteSocioRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default aporteSocioRouter;