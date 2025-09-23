import express, { Request, Response } from 'express';
import { signIn, signUp, getAll, getById, update, remove, logOut, checkUser, checkAdmin } from '../controllers/usuarioController.js';
import { handleValidationErrors, loginValidation, idParamValidation } from '../middlewares/validations.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
const usuarioRouter = express.Router();

usuarioRouter.get('/check-user', 
    verifyToken,
    (req: Request, res: Response) => {checkUser(req, res)}
);

usuarioRouter.get('/check-admin', 
    verifyToken,
    verifyAdmin,
    (req: Request, res: Response) => {checkAdmin(req, res)}
);

usuarioRouter.post('/logout', 
    verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {logOut(req, res)}
);

usuarioRouter.get('/',
    verifyToken,
    verifyAdmin,
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);

usuarioRouter.get('/:id', 
    verifyToken,
    verifyAdmin,
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
    verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);

usuarioRouter.delete('/delete/:id', 
    idParamValidation,
    verifyToken,
    verifyAdmin,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);


export default usuarioRouter;
