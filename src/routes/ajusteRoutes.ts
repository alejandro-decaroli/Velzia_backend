import express, { Request, Response } from 'express';
import ajusteController from '../controllers/ajusteController.js';

const ajusteRouter = express.Router();

ajusteRouter.get('/', (req: Request, res: Response) => {ajusteController.getAll(req, res)});
ajusteRouter.get('/:id', (req: Request, res: Response) => {ajusteController.getById(req, res)});
ajusteRouter.post('/create', (req: Request, res: Response) => {ajusteController.create(req, res)});
ajusteRouter.put('/update/:id', (req: Request, res: Response) => {ajusteController.update(req, res)});
ajusteRouter.delete('/delete/:id', (req: Request, res: Response) => {ajusteController.remove(req, res)});

export default ajusteRouter;