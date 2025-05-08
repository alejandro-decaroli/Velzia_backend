import express, { Request, Response } from 'express';
import pagoController from '../controllers/pagoController.js';

const pagoRouter = express.Router();

pagoRouter.get('/', (req: Request, res: Response) => {pagoController.getAll(req, res)});
pagoRouter.get('/:id', (req: Request, res: Response) => {pagoController.getById(req, res)});
pagoRouter.post('/create', (req: Request, res: Response) => {pagoController.create(req, res)});
pagoRouter.put('/update/:id', (req: Request, res: Response) => {pagoController.update(req, res)});
pagoRouter.delete('/delete/:id', (req: Request, res: Response) => {pagoController.remove(req, res)});

export default pagoRouter;