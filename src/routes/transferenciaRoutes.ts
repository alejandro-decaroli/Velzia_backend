import express, { Request, Response } from 'express';
import transferenciaController from '../controllers/transferenciaController.js';

const transferenciaRouter = express.Router();

transferenciaRouter.get('/', (req: Request, res: Response) => {transferenciaController.getAll(req, res)});
transferenciaRouter.get('/:id', (req: Request, res: Response) => {transferenciaController.getById(req, res)});
transferenciaRouter.post('/create', (req: Request, res: Response) => {transferenciaController.create(req, res)});
transferenciaRouter.put('/update/:id', (req: Request, res: Response) => {transferenciaController.update(req, res)});
transferenciaRouter.delete('/delete/:id', (req: Request, res: Response) => {transferenciaController.remove(req, res)});

export default transferenciaRouter;