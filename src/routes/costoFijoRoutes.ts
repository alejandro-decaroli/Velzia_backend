import express, { Request, Response } from 'express';
import costoFijoController from '../controllers/costoFijoController.js';

const costoFijoRouter = express.Router();

costoFijoRouter.get('/', (req: Request, res: Response) => {costoFijoController.getAll(req, res)});
costoFijoRouter.get('/:id', (req: Request, res: Response) => {costoFijoController.getById(req, res)});
costoFijoRouter.post('/create', (req: Request, res: Response) => {costoFijoController.create(req, res)});
costoFijoRouter.put('/update/:id', (req: Request, res: Response) => {costoFijoController.update(req, res)});
costoFijoRouter.delete('/delete/:id', (req: Request, res: Response) => {costoFijoController.remove(req, res)});

export default costoFijoRouter;