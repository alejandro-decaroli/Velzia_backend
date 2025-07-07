import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/transferenciaController.js';
import { transferenciaValidation, handleValidationErrors, idParamValidation } from '../middlewares/validations.js';

const transferenciaRouter = express.Router();

transferenciaRouter.get('/', 
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
transferenciaRouter.get('/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
transferenciaRouter.post('/create', 
    transferenciaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
transferenciaRouter.put('/update/:id', 
    idParamValidation,
    transferenciaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);
transferenciaRouter.delete('/delete/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

export default transferenciaRouter;