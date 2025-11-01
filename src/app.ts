import express from "express";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema, seed } from "./db/orm.js";
import clienteRouter from "./routes/clienteRoutes.js";
import cajaRouter from "./routes/cajaRoutes.js";
import pagoRouter from "./routes/pagoRoutes.js";
import ventaRouter from "./routes/ventaRoutes.js";
import costoFijoRouter from "./routes/costoFijoRoutes.js";
import costoVariableRouter from "./routes/costoVariableRoutes.js";
import ajusteRouter from "./routes/ajusteRoutes.js";
import aporteSocioRouter from "./routes/aporteSocioRoutes.js";
import dividendoSocioRouter from "./routes/dividendoSocioRoutes.js";
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
app.use('/costos_variables', costoVariableRouter);
app.use('/ajustes', ajusteRouter);
app.use('/aportes_socio', aporteSocioRouter);
app.use('/dividendos_socio', dividendoSocioRouter);
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
        process.exit(1); // Avisa a Render que el proceso falló
    }
})();

app.get('/', (req: Request, res: Response) => {
    res.json('Backend Velzia desplegado!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


