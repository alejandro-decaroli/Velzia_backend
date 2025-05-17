import express, { Request, Response } from 'express';
import dividendoSocioController from '../controllers/dividendoSocioController.js';

const dividendoSocioRouter = express.Router();

dividendoSocioRouter.get('/', (req: Request, res: Response) => {dividendoSocioController.getAll(req, res)});
dividendoSocioRouter.get('/:id', (req: Request, res: Response) => {dividendoSocioController.getById(req, res)});
dividendoSocioRouter.post('/create', (req: Request, res: Response) => {dividendoSocioController.create(req, res)});
dividendoSocioRouter.put('/update/:id', (req: Request, res: Response) => {dividendoSocioController.update(req, res)});
dividendoSocioRouter.delete('/delete/:id', (req: Request, res: Response) => {dividendoSocioController.remove(req, res)});

export default dividendoSocioRouter;