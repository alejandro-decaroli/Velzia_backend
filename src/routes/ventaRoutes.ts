import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/ventaController.js';

const ventaRouter = express.Router();

ventaRouter.get('/', 
    (req: Request, res: Response) => {getAll(req, res)}
);
ventaRouter.get('/:id', 
    (req: Request, res: Response) => {getById(req, res)}
);
ventaRouter.post('/create', 
    (req: Request, res: Response) => {create(req, res)}
);
ventaRouter.put('/update/:id', 
    (req: Request, res: Response) => {update(req, res)}
);
ventaRouter.delete('/delete/:id', 
    (req: Request, res: Response) => {remove(req, res)}
);

export default ventaRouter;