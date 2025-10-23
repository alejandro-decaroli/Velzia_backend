import express, { Request, Response } from 'express';
import { handleValidationErrors, idParamValidation, productoValidation } from '../middlewares/validations.js';
import { create, getAll, getById, update, remove } from '../controllers/productoController.js';
import { verifyToken } from '../middlewares/auth.js';

const productoRouter = express.Router();

productoRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

productoRouter.get('/:id', 
  verifyToken, 
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

productoRouter.post('/create',
  verifyToken,
  productoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

productoRouter.put('/update/:id', 
  verifyToken,
  idParamValidation,
  productoValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

productoRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default productoRouter;