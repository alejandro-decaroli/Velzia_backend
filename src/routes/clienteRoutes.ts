import express, { Request, Response } from 'express';
import clienteController from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {clienteController.getAll(req, res)});
router.get('/:id', (req: Request, res: Response) => {clienteController.getById(req, res)});
router.post('/', (req: Request, res: Response) => {clienteController.create(req, res)});
router.put('/:id', (req: Request, res: Response) => {clienteController.update(req, res)});
router.delete('/:id', (req: Request, res: Response) => {clienteController.remove(req, res)});

export default router;