import { Request, Response, response } from 'express';
import { getAllUsuarios, getByIdUsuario, updateUsuario, removeUsuario, sign_In, sign_Up} from '../services/usuarioServices.js';
import dotenv from "dotenv";
dotenv.config();

async function signIn(req: Request, res: Response) {
  try {
    const user_data = await sign_In(req);
    const user_json = user_data.user;
    const token = user_data.token;
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Usuario autenticado exitosamente', user_json });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al autenticar el usuario' });
  }
}

async function signUp(req: Request, res: Response) {
  try {
    const nuevoUsuario = await sign_Up(req);
    const user_json = nuevoUsuario.user;
    const token = nuevoUsuario.token;
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(201).json({ message: 'Usuario creado exitosamente', user_json });
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
    await updateUsuario(req.body, Number(req.params.id));
    res.status(201).json({ message: 'Usuario actualizado exitosamente' });
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

async function logOut(req: Request, res: Response) {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Usuario desautenticado exitosamente' });
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error al desautenticar el usuario' });
  }
}

async function checkUser(req: Request, res: Response) {
  try {
    const cookie = req.cookies.token;
    if (!cookie) {
      return res.status(401).json({ message: 'No tiene permisos para acceder, inicie sesión' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'No tiene permisos para acceder, inicie sesión' });
    }
    const {nombre, apellido, email} = req.user;
    return res.status(200).json({ message: 'Usuario autenticado exitosamente', nombre, apellido, email });
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Error al autenticar el usuario' });
  }
}

async function checkAdmin(req: Request, res: Response) {
  try {
    const cookie = req.cookies.token;
    if (!cookie) {
      return res.status(401).json({ message: 'No tiene permisos para acceder, inicie sesión' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'No tiene permisos para acceder, inicie sesión' });
    }
    const {nombre, apellido, email} = req.user;
    return res.status(200).json({ message: 'Usuario autenticado exitosamente', nombre, apellido, email });
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Error al autenticar el usuario' });
  }
}

export {
  signIn,
  signUp,
  getAll,
  getById,
  update,
  remove,
  logOut,
  checkUser,
  checkAdmin
};