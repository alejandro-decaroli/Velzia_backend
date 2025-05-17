import express, { Request, Response } from 'express';
import aporteSocioController from '../controllers/aporteSocioController.js';
import { handleValidationErrors, idParamValidation, aporteDividendoSocioValidation } from '../middlewares/validations.js';

const aporteSocioRouter = express.Router();

aporteSocioRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {aporteSocioController.getAll(req, res)}
);

aporteSocioRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {aporteSocioController.getById(req, res)}
);

aporteSocioRouter.post('/create', 
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {aporteSocioController.create(req, res)}
);

aporteSocioRouter.put('/update/:id', 
  idParamValidation,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {aporteSocioController.update(req, res)}
);

aporteSocioRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {aporteSocioController.remove(req, res)}
);

export default aporteSocioRouter;