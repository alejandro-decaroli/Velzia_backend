import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/costoVariableController.js';
import { handleValidationErrors, idParamValidation, costoVariableValidation } from '../middlewares/validations.js';

const costoVariableRouter = express.Router();

costoVariableRouter.get('/',
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
costoVariableRouter.get('/:id',
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
costoVariableRouter.post('/create',
    costoVariableValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
costoVariableRouter.put('/update/:id',
    idParamValidation,
    costoVariableValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);
costoVariableRouter.delete('/delete/:id',
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

export default costoVariableRouter;