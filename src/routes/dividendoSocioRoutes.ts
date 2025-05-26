import express, { Request, Response } from 'express';
import dividendoSocioController from '../controllers/dividendoSocioController.js';
import { handleValidationErrors, idParamValidation, aporteDividendoSocioValidation } from '../middlewares/validations.js';

const dividendoSocioRouter = express.Router();

dividendoSocioRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {dividendoSocioController.getAll(req, res)}
);

dividendoSocioRouter.get('/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {dividendoSocioController.getById(req, res)}
);

dividendoSocioRouter.post('/create', 
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {dividendoSocioController.create(req, res)}
);

dividendoSocioRouter.put('/update/:id', 
  idParamValidation,
  aporteDividendoSocioValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {dividendoSocioController.update(req, res)}
);

dividendoSocioRouter.delete('/delete/:id', 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {dividendoSocioController.remove(req, res)}
);

export default dividendoSocioRouter;