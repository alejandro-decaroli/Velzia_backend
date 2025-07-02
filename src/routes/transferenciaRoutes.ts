import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/transferenciaController.js';

const transferenciaRouter = express.Router();

transferenciaRouter.get('/', 
    (req: Request, res: Response) => {getAll(req, res)}
);
transferenciaRouter.get('/:id', 
    (req: Request, res: Response) => {getById(req, res)}
);
transferenciaRouter.post('/create', 
    (req: Request, res: Response) => {create(req, res)}
);
transferenciaRouter.put('/update/:id', 
    (req: Request, res: Response) => {update(req, res)}
);
transferenciaRouter.delete('/delete/:id', 
    (req: Request, res: Response) => {remove(req, res)}
);

export default transferenciaRouter;