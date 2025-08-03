import express, { Request, Response } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/tasaController.js';
import { handleValidationErrors, idParamValidation, tasaValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';

const tasaRouter = express.Router();

tasaRouter.get('/', 
  verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)});
tasaRouter.get('/:id', 
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)});
tasaRouter.post('/create', 
  verifyToken,
    tasaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)});
tasaRouter.put('/update/:id', 
  verifyToken,
    idParamValidation,
    tasaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)});
tasaRouter.delete('/delete/:id', 
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)});

export default tasaRouter;