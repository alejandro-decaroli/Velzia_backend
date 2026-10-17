import express, { Request, Response } from 'express';
import { 
  handleValidationErrors, 
  idParamValidation, 
  CajaValidation,
  transferenciaValidation,
  conciliacionValidation 
} from '../middlewares/validations.js';
import { 
  getAll, 
  getById, 
  create, 
  update, 
  remove, 
  transferir, 
  getConciliacion, 
  conciliar 
} from '../controllers/cajaController.js';
import { verifyToken } from '../middlewares/auth.js';

const cajaRouter = express.Router();

cajaRouter.get('/', 
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getAll(req, res)}
);

// Conciliación de todas las cajas (monto actual)
cajaRouter.get('/conciliacion',
  verifyToken,
  handleValidationErrors,
  (req: Request, res: Response) => {getConciliacion(req, res)}
);

// Realizar transferencia entre cajas
cajaRouter.post('/transferencia',
  verifyToken,
  transferenciaValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {transferir(req, res)}
);

cajaRouter.post('/transferir',
  verifyToken,
  transferenciaValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {transferir(req, res)}
);

// Realizar conciliación (recibiendo caja_id en body o en param)
cajaRouter.post('/conciliacion',
  verifyToken,
  conciliacionValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {conciliar(req, res)}
);

cajaRouter.get('/:id/conciliacion',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getConciliacion(req, res)}
);

cajaRouter.post('/:id/conciliar',
  verifyToken,
  idParamValidation,
  conciliacionValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {conciliar(req, res)}
);

cajaRouter.post('/:id/transferir',
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {transferir(req, res)}
);

cajaRouter.get('/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {getById(req, res)}
);

cajaRouter.post('/create',
  verifyToken,
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {create(req, res)}
);

cajaRouter.put('/update/:id', 
  verifyToken,
  idParamValidation, 
  CajaValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {update(req, res)}
);

cajaRouter.delete('/delete/:id', 
  verifyToken,
  idParamValidation, 
  handleValidationErrors,
  (req: Request, res: Response) => {remove(req, res)}
);

export default cajaRouter;
