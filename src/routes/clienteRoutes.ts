import express, { Request, Response } from 'express';
import clienteController from '../controllers/clienteController.js';

const clienteRouter = express.Router();

clienteRouter.get('/', (req: Request, res: Response) => {clienteController.getAll(req, res)});
clienteRouter.get('/:id', (req: Request, res: Response) => {clienteController.getById(req, res)});
clienteRouter.post('/create', (req: Request, res: Response) => {clienteController.create(req, res)});
clienteRouter.put('/update/:id', (req: Request, res: Response) => {clienteController.update(req, res)});
clienteRouter.delete('/delete/:id', (req: Request, res: Response) => {clienteController.remove(req, res)});

export default clienteRouter;