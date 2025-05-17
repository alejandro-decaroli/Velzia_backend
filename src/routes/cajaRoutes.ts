import express, { Request, Response } from 'express';
import cajaController from '../controllers/cajaController.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {cajaController.getAll(req, res)});
router.get('/:id', (req: Request, res: Response) => {cajaController.getById(req, res)});
router.post('/create', (req: Request, res: Response) => {cajaController.create(req, res)});
router.put('/update/:id', (req: Request, res: Response) => {cajaController.update(req, res)});
router.delete('/delete/:id', (req: Request, res: Response) => {cajaController.remove(req, res)});

export default router;