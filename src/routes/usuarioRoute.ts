import express, { Request, Response } from 'express';
import { signIn, signUp, getAll, getById, update, remove } from '../controllers/usuarioController.js';
import { handleValidationErrors, loginValidation, idParamValidation } from '../middlewares/validations.js';
const usuarioRouter = express.Router();


usuarioRouter.get('/',
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);

usuarioRouter.get('/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);

usuarioRouter.post('/login', 
    loginValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {signIn(req, res)}
);

usuarioRouter.post('/sign-up', 
    loginValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {signUp(req, res)}
);

usuarioRouter.put('/update/:id', 
    idParamValidation,
    loginValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);

usuarioRouter.delete('/delete/:id', 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

export default usuarioRouter;
