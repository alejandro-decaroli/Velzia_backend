import { orm } from '../db/orm.js';
import { Usuario } from '../entities/Usuario.entities.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express, { Response, Request } from 'express';

dotenv.config();

const { BadRequest, NotFound, Conflict } = createError;
const em = orm.em.fork(); // Fork the entity manager for each request

export async function sign_In(req: Request) {
  const usuario = await em.findOne(Usuario, { email: req.body.email });
  if (!usuario) {
    throw new NotFound('Usuario o contraseña incorrectos');
  }

  const contraseniaValida = await bcrypt.compare(req.body.contrasenia, usuario.contrasenia);
  if (!contraseniaValida) {
    throw new BadRequest('Usuario o contraseña incorrectos');
  }
  const payload = {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido
  };

  // 🔐 Firmar token con una clave secreta
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno");
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY!, {
    expiresIn: "1h" // o el tiempo que quieras
  });

  return { token, user: payload }; // Devuelve el usuario creado
}

export async function sign_Up(req: Request) {
  const usuarioExistente = await em.findOne(Usuario, { email: req.body.email });
  if (usuarioExistente) {
    throw new Conflict('El correo electrónico ya está en uso');
  }

  const saltRounds = 10;
  req.body.contrasenia = await bcrypt.hash(req.body.contrasenia, saltRounds);

  const nuevoUsuario = em.create(Usuario, req.body);
  await em.flush();
  const usuario = await em.findOne(Usuario, { email: req.body.email });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  const payload = {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido
  };

  // 🔐 Firmar token con una clave secreta
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno");
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY!, {
    expiresIn: "1h" // o el tiempo que quieras
  });

  return { token, user: payload }; // Devuelve el usuario creado
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

export async function updateUsuario(req:any, id:number) {
    const usuario = await em.findOne(Usuario, id);
    if (!usuario) {
        throw new NotFound('Usuario no encontrado');
    }
    usuario.nombre = req.nombre;
    usuario.apellido = req.apellido;
    const saltRounds = 10;
    usuario.contrasenia = await bcrypt.hash(req.contrasenia, saltRounds);
    usuario.email = req.email;
    usuario.actualizadoEn = new Date();
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