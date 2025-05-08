import express, { Request, Response } from 'express';
import cajaController from '../controllers/cajaController.js';

const cajaRouter = express.Router();

cajaRouter.get('/', (req: Request, res: Response) => {cajaController.getAll(req, res)});
cajaRouter.get('/:id', (req: Request, res: Response) => {cajaController.getById(req, res)});
cajaRouter.post('/create', (req: Request, res: Response) => {cajaController.create(req, res)});
cajaRouter.put('/update/:id', (req: Request, res: Response) => {cajaController.update(req, res)});
cajaRouter.delete('/delete/:id', (req: Request, res: Response) => {cajaController.remove(req, res)});

export default cajaRouter;