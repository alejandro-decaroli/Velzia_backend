import express, { Request, Response } from 'express';
import tasaController from '../controllers/tasaController.js';

const tasaRouter = express.Router();

tasaRouter.get('/', (req: Request, res: Response) => {tasaController.getAll(req, res)});
tasaRouter.get('/:id', (req: Request, res: Response) => {tasaController.getById(req, res)});
tasaRouter.post('/create', (req: Request, res: Response) => {tasaController.create(req, res)});
tasaRouter.put('/update/:id', (req: Request, res: Response) => {tasaController.update(req, res)});
tasaRouter.delete('/delete/:id', (req: Request, res: Response) => {tasaController.remove(req, res)});

export default tasaRouter;