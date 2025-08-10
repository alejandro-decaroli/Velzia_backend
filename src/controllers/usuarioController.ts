import { Request, Response, response } from 'express';
import { getAllUsuarios, getByIdUsuario, updateUsuario, removeUsuario, sign_In, sign_Up} from '../services/usuarioServices.js';

async function signIn(req: Request, res: Response) {
  try {
    const usuario = await sign_In(req);
    res.status(200).json(usuario);
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al autenticar el usuario' });
  }
}

async function signUp(req: Request, res: Response) {
  try {
    const nuevoUsuario = await sign_Up(req);
    res.status(201).json(nuevoUsuario);
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al crear el usuario' });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const usuarios = await getAllUsuarios();
    res.status(200).json({ message: 'Usuarios obtenidos exitosamente', usuarios });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al obtener los usuarios' });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const usuario = await getByIdUsuario(Number(req.params.id));
    res.status(200).json({ message: 'Usuario obtenido exitosamente', usuario });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al obtener el usuario' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const usuario = await updateUsuario(req.body, Number(req.params.id));
    res.status(201).json({ message: 'Usuario actualizado exitosamente', usuario });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al actualizar el usuario' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    await removeUsuario(Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al eliminar el usuario' });
  }
}

export {
  signIn,
  signUp,
  getAll,
  getById,
  update,
  remove
};