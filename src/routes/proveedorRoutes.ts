import express, { Request, Response } from 'express';
import {
  handleValidationErrors,
  idParamValidation,
  proveedorValidation
} from '../middlewares/validations.js';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/proveedorController.js';
import { verifyToken } from '../middlewares/auth.js';

const proveedorRouter = express.Router();

proveedorRouter.get('/',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => { getAll(req, res); }
);

proveedorRouter.get('/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { getById(req, res); }
);

proveedorRouter.post('/create',
  verifyToken,
  proveedorValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { create(req, res); }
);

proveedorRouter.put('/update/:id',
  verifyToken,
  idParamValidation,
  proveedorValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { update(req, res); }
);

proveedorRouter.delete('/delete/:id',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => { remove(req, res); }
);

export default proveedorRouter;
