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


const PORT = process.env.PORT || 3000;


const app = express();
let front_url: string;
if (process.env.NODE_ENV === 'development') {
    front_url = "http://localhost:5173";
}
else {
    front_url = process.env.FRONTEND_URL || "http://localhost:5173";
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {origin: front_url.toString(), 
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

if (process.env.NODE_ENV === 'development') {
    (async () => {
        await syncSchema();
        if (process.env.START_SEEDERS === 'true') {
            await seed();
        }
    })();
} else {
    if (process.env.START_SEEDERS === 'true') {
        await seed();
    }
}

app.listen(PORT, () => {
})


