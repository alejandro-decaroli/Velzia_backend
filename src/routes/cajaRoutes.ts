/* import express, { Request, Response } from 'express';
import cajaController from '../controllers/cajaController.js';
import { handleValidationErrors, idParamValidation, CajaValidation } from '../middlewares/validations.js';

const cajaRouter = express.Router();

cajaRouter.get('/', 
  handleValidationErrors,
  (req: Request, res: Response) => {cajaController.getAll(req, res)}
);

cajaRouter.get('/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {cajaController.getById(req, res)}
);

cajaRouter.post('/create', 
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {cajaController.create(req, res)}
);

cajaRouter.put('/update/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {cajaController.update(req, res)}
);

cajaRouter.delete('/delete/:id', 
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {cajaController.remove(req, res)}
);

export default cajaRouter;
 */