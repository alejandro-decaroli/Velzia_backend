import express, { Request, Response } from 'express';
import ventaController from '../controllers/ventaController.js';

const ventaRouter = express.Router();

ventaRouter.get('/', (req: Request, res: Response) => {ventaController.getAll(req, res)});
ventaRouter.get('/:id', (req: Request, res: Response) => {ventaController.getById(req, res)});
ventaRouter.post('/create', (req: Request, res: Response) => {ventaController.create(req, res)});
ventaRouter.put('/update/:id', (req: Request, res: Response) => {ventaController.update(req, res)});
ventaRouter.delete('/delete/:id', (req: Request, res: Response) => {ventaController.remove(req, res)});

export default ventaRouter;