import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req: Request, res: Response, next: NextFunction) {

  let token = req.cookies?.token;

  // 👇 Si no hay cookie, probamos con header Authorization
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno");
  }

  try {
    // 👇 Forzamos el tipo correcto del payload (coincide con el que definiste en index.d.ts)
    const decoded = jwt.verify(token, secret) as {
      rol: string;
      id: number;
      email: string;
      nombre: string;
      apellido: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const rol = req.user?.rol;
    if (rol !== 'admin') {
      res.status(403).json({ message: 'No tiene permisos para acceder' });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
}