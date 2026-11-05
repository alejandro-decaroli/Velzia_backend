import { Request, Response } from 'express';
import { createProducto, getAllProductos, getByIdProducto, updateProducto, removeProducto, createBulkProductos } from '../services/productoService.js'
async function getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const {fecha} : any = req.query;
      const productos = await getAllProductos(Number(userId), fecha);
      res.status(200).json({ message: 'Productos obtenidos exitosamente', productos });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}

async function getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const producto = await getByIdProducto(Number(userId), Number(req.params.id));
      res.status(200).json({ message: 'Producto obtenido exitosamente', producto });
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await createProducto(req.body, Number(userId));
      res.status(201).json({ message: 'Producto creado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await updateProducto(req.body , Number(userId), Number(req.params.id));
      res.status(201).json({ message: 'Producto actualizado exitosamente'});
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await removeProducto(Number(userId), Number(req.params.id));
      res.status(204).send()
    } catch (error: any) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno' });
    }
  }

async function bulkCreate(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { productos } = req.body;
    const resultado = await createBulkProductos(productos, Number(userId));
    res.status(201).json({ 
      message: `${resultado.insertados} productos importados exitosamente`, 
      ...resultado 
    });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al importar productos' });
  }
}

export {
  getAll,
  getById,
  create,
  bulkCreate,
  update,
  remove
}; 
