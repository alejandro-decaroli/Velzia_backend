import express from "express";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema, seed } from "./db/orm.js";
import clienteRouter from "./routes/clienteRoutes.js";
import cajaRouter from "./routes/cajaRoutes.js";
import ventaRouter from "./routes/ventaRoutes.js";
import costoRouter from "./routes/costoRoutes.js";
import usuarioRouter from "./routes/usuarioRoute.js";
import productoRouter from "./routes/productoRoutes.js";
import proveedorRouter from "./routes/proveedorRoutes.js";
import pedidoRouter from "./routes/pedidoRoutes.js";
import lineaPedidoRouter from "./routes/lineaPedidoRoutes.js";
import movimientoRouter from "./routes/movimientoRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

const app = express();
const allowedOrigins = [
    "https://velzia-frontend.onrender.com",
    "http://localhost:5173",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/$/, "")] : [])
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(orm.em, next);   
})

app.use('/usuarios', usuarioRouter);
app.use('/clientes', clienteRouter);
app.use('/cajas', cajaRouter);
app.use('/ventas', ventaRouter);
app.use('/costos', costoRouter);
app.use('/costos_fijos', costoRouter);
app.use('/productos', productoRouter);
app.use('/proveedores', proveedorRouter);
app.use('/pedidos', pedidoRouter);
app.use('/lineas_pedidos', lineaPedidoRouter);
app.use('/lineas_pedido', lineaPedidoRouter);
app.use('/movimientos', movimientoRouter);
app.use('/movimientos_financieros', movimientoRouter);
app.use('/historial_financiero', movimientoRouter);


app.get('/', (req: Request, res: Response) => {
    res.json('Backend Velzia desplegado!');
});

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
