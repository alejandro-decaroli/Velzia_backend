import express, { Request, Response } from 'express';
import { signIn, signUp, getAll, getById, update, remove, logOut, checkUser } from '../controllers/usuarioController.js';
import { handleValidationErrors, loginValidation, idParamValidation } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';
const usuarioRouter = express.Router();

usuarioRouter.get('/check-user', 
    (req: Request, res: Response) => {checkUser(req, res)}
);

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

usuarioRouter.post('/logout', 
    handleValidationErrors,
    (req: Request, res: Response) => {logOut(req, res)}
);


export default usuarioRouter;
