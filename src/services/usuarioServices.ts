import { orm } from '../db/orm.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

const { BadRequest, NotFound, Conflict } = createError;
const em = orm.em.fork(); // Fork the entity manager for each request

export async function sign_In(data: any) {
  const usuario = await em.findOne(Usuario, { email: data.email });
  if (!usuario) {
    throw new NotFound('Usuario o contraseña incorrectos');
  }

  const contraseniaValida = await bcrypt.compare(data.contrasenia, usuario.contrasenia);
  if (!contraseniaValida) {
    throw new BadRequest('Usuario o contraseña incorrectos');
  }
  
  return usuario; 
}

export async function sign_Up(data: any) {
  const usuarioExistente = await em.findOne(Usuario, { email: data.email });
  if (usuarioExistente) {
    throw new Conflict('El correo electrónico ya está en uso');
  }

  const saltRounds = 10;
  data.contrasenia = await bcrypt.hash(data.contrasenia, saltRounds);

  const nuevoUsuario = em.create(Usuario, data);
  await em.flush();
  
  return nuevoUsuario; // Devuelve el usuario creado
}

export async function getAllUsuarios() {
    const usuarios = await em.find(Usuario, {});
    return usuarios;
}

export async function getByIdUsuario(id:number) {
    const usuario = await em.findOne(Usuario, id);
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    return usuario;
}

export async function updateUsuario(data:any, id:number) {
    const usuario = await em.findOne(Usuario, id);
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    usuario.nombre = data.nombre;
    usuario.apellido = data.apellido;
    const saltRounds = 10;
    usuario.contrasenia = await bcrypt.hash(data.contrasenia, saltRounds);
    usuario.email = data.email;
    await em.flush();
}

export async function removeUsuario(id:number) {
    const usuario = await em.findOne(Usuario, id);
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    await em.remove(usuario);
    await em.flush();
}