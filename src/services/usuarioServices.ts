import { orm } from '../db/orm.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function sign_In(data:any) {
    const usuario = await em.findOne(Usuario, { email: data.email });
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    if (usuario.contrasenia !== data.contrasenia) {
        throw new BadRequest('Contraseña incorrecta');
    }
}

export async function sign_Up(data:any) {
    const usuario = await em.findOne(Usuario, { email: data.email });
    if (usuario) {
        throw new Conflict('El usuario ya existe');
    }
    await em.create(Usuario, data);
    await em.flush();
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
    usuario.contrasenia = data.contrasenia;
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