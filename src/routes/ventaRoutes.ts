import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/ventaController.js';
import { ventaValidation, idParamValidation, handleValidationErrors } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';
const ventaRouter = express.Router();

ventaRouter.get('/', 
  verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
ventaRouter.get('/:id',
  verifyToken, 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
ventaRouter.post('/create', 
  verifyToken,
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
ventaRouter.put('/update/:id',
  verifyToken, 
    idParamValidation,
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);
ventaRouter.delete('/delete/:id', 
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

export default ventaRouter;