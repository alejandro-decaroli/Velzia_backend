import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/costoVariableController.js';

const costoVariableRouter = express.Router();

costoVariableRouter.get('/',
    (req: Request, res: Response) => {getAll(req, res)}
);
costoVariableRouter.get('/:id',
    (req: Request, res: Response) => {getById(req, res)}
);
costoVariableRouter.post('/create',
    (req: Request, res: Response) => {create(req, res)}
);
costoVariableRouter.put('/update/:id',
    (req: Request, res: Response) => {update(req, res)}
);
costoVariableRouter.delete('/delete/:id',
    (req: Request, res: Response) => {remove(req, res)}
);

export default costoVariableRouter;