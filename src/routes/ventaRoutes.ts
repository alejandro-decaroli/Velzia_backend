import express, { Request, Response } from 'express';
import { create, getAll, getById, remove, update, cancelar, pagar, getListadoVentasByRangeDate, registrarDetalleVenta, getDetalleVenta, updateDetalleVenta, deleteDetalleVenta } from '../controllers/ventaController.js';
import { ventaValidation, idParamValidation, handleValidationErrors } from '../middlewares/validations.js';
import { verifyToken } from '../middlewares/auth.js';
const ventaRouter = express.Router();

ventaRouter.get('/', 
  verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {getAll(req, res)}
);
ventaRouter.get('/:id',
  verifyToken, 
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {getById(req, res)}
);
ventaRouter.post('/create', 
  verifyToken,
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {create(req, res)}
);
ventaRouter.put('/update/:id',
  verifyToken, 
    idParamValidation,
    ventaValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {update(req, res)}
);

ventaRouter.put('/cancelar/:id',
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {cancelar(req, res)}
);

ventaRouter.post('/pagar/:id',
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {pagar(req, res)}
);

ventaRouter.delete('/delete/:id', 
  verifyToken,
    idParamValidation,
    handleValidationErrors,
    (req: Request, res: Response) => {remove(req, res)}
);

ventaRouter.get('/listado', 
  verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {getListadoVentasByRangeDate(req, res)}
);  

ventaRouter.post('/registrar_detalle/:id', 
    verifyToken,
    handleValidationErrors,
    (req: Request, res: Response) => {registrarDetalleVenta(req, res)}
);

ventaRouter.get('/detalle/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {getDetalleVenta(req, res)}
);

ventaRouter.delete('/detalle/delete/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {deleteDetalleVenta(req, res)}
);

ventaRouter.put('/detalle/update/:id', 
  verifyToken,
  idParamValidation,
  handleValidationErrors,
  (req: Request, res: Response) => {updateDetalleVenta(req, res)}
);

export default ventaRouter;