import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno");
  }

  try {
    // 👇 Forzamos el tipo correcto del payload (coincide con el que definiste en index.d.ts)
    const decoded = jwt.verify(token, secret) as {
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