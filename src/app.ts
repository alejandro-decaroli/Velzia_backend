import express from "express";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema, seed } from "./db/orm.js";
import clienteRouter from "./routes/clienteRoutes.js";
import cajaRouter from "./routes/cajaRoutes.js";
import pagoRouter from "./routes/pagoRoutes.js";
import ventaRouter from "./routes/ventaRoutes.js";4
import costoFijoRouter from "./routes/costoFijoRoutes.js";
import ajusteRouter from "./routes/ajusteRoutes.js";
import transferenciaRouter from "./routes/transferenciaRoutes.js";
import tasaRouter from "./routes/tasaRoutes.js";
import monedaRouter from "./routes/monedaRoutes.js";
import usuarioRouter from "./routes/usuarioRoute.js";
import productoRouter from "./routes/productoRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

const app = express();
const front_url = process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : process.env.FRONTEND_URL || "https://velzia-frontend.onrender.com";

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {origin: [front_url.toString()], 
    credentials: true,
    }
));

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(orm.em, next);   
})

app.use('/usuarios', usuarioRouter);
app.use('/clientes', clienteRouter);
app.use('/cajas', cajaRouter);
app.use('/pagos', pagoRouter); 
app.use('/ventas', ventaRouter)
app.use('/costos_fijos', costoFijoRouter);
app.use('/ajustes', ajusteRouter);
app.use('/transferencias', transferenciaRouter);
app.use('/tasas', tasaRouter);
app.use('/monedas', monedaRouter);
app.use('/productos', productoRouter);

(async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await syncSchema();
            if (process.env.START_SEEDERS === "true") {
                await seed();
            }
        } else {
            if (process.env.START_SEEDERS === "true") {
                await seed();
            }
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1); 
    }
})();

app.get('/', (req: Request, res: Response) => {
    res.json('Backend Velzia desplegado!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


/*
    1) Eliminar todos los comentarios []
    2) Desplegar en Render
    3) Agregar descripcion al propousal [x]
    4) Revisar modelo de dominio []
    5) Reciclar codigo del front, mejorarlo con Claude, y redefinir que reportes mostrar
    6) Escribir test unitarios e integradores
    7) Revisar que funcionen todos los http
    8) Error al crear tasas
    9) Las cajas junto con otras entidades no se cargan de manera predeterminada
    10) object.Object en tasas y monedas (columnas repetidas)
    11) Mejorar la seccion de reportes
*/
