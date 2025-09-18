import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update, pagar } from '../controllers/costoVariableController.js';
import { handleValidationErrors, idParamValidation, costoVariableValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const costoVariableRouter = express.Router();

costoVariableRouter.get('/',
  verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
costoVariableRouter.get('/:id',
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
costoVariableRouter.post('/create',
  verifyToken,
    costoVariableValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
costoVariableRouter.put('/update/:id',
  verifyToken,
    idParamValidation,
    costoVariableValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);
costoVariableRouter.delete('/delete/:id',
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

costoVariableRouter.post('/pagar/:id',
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {pagar(req, res)}
);

export default costoVariableRouter;