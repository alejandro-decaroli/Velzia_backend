import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/ventaController.js';
import { ventaValidation, idParamValidation, handleValidationErrors } from '../middlewares/validations.js';

const ventaRouter = express.Router();

ventaRouter.get('/', 
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
ventaRouter.get('/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
ventaRouter.post('/create', 
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
ventaRouter.put('/update/:id', 
    idParamValidation,
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);
ventaRouter.delete('/delete/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

export default ventaRouter;