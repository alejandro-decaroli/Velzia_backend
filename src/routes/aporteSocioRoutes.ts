import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, aporteDividendoSocioValidation } from '../middlewares/validations.js';
import { create, getAll, getById, update, remove } from '../controllers/aporteSocioController.js';
import { verifyToken } from '../middlewares/auth.js';

const aporteSocioRouter = express.Router();

aporteSocioRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

aporteSocioRouter.get('/:id', 
  verifyToken, 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

aporteSocioRouter.post('/create',
  verifyToken,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

aporteSocioRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

aporteSocioRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default aporteSocioRouter;