import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, aporteDividendoSocioValidation } from '../middlewares/validations.js';
import { getAll, getById, create, update, remove } from '../controllers/dividendoSocioController.js';

const dividendoSocioRouter = express.Router();

dividendoSocioRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

dividendoSocioRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

dividendoSocioRouter.post('/create', 
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

dividendoSocioRouter.put('/update/:id', 
  idParamValidation,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

dividendoSocioRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default dividendoSocioRouter;