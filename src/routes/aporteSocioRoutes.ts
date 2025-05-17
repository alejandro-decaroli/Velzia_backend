import express, { Request, Response } from 'express';
import aporteSocioController from '../controllers/aporteSocioController.js';

const aporteSocioRouter = express.Router();

aporteSocioRouter.get('/', (req: Request, res: Response) => {aporteSocioController.getAll(req, res)});
aporteSocioRouter.get('/:id', (req: Request, res: Response) => {aporteSocioController.getById(req, res)});
aporteSocioRouter.post('/create', (req: Request, res: Response) => {aporteSocioController.create(req, res)});
aporteSocioRouter.put('/update/:id', (req: Request, res: Response) => {aporteSocioController.update(req, res)});
aporteSocioRouter.delete('/delete/:id', (req: Request, res: Response) => {aporteSocioController.remove(req, res)});

export default aporteSocioRouter;