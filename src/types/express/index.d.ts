export {}; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        rol: string;
        email: string;
        nombre: string;
        apellido: string;
      };
    }
  }
}