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
app.use('/ventas', ventaRouter);
app.use('/costos', costoRouter);
app.use('/costos_fijos', costoRouter);
app.use('/productos', productoRouter);
app.use('/proveedores', proveedorRouter);
app.use('/pedidos', pedidoRouter);
app.use('/lineas_pedidos', lineaPedidoRouter);
app.use('/lineas_pedido', lineaPedidoRouter);


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


/*
    
    1) Eliminar todo de moneda y tasas [x]
    2) Cambiar atributos y nombre de costos fijos [x]
    3) Crear proveedores [x]
    4) Crear pedidos [x]
    5) Crear tabla intermedia de linea de pedidos [x]
    6) Venta, Pedido y Costo deben tener un solo Pago no varios [x]
    REVISAR CONTROLADORES Y SEEDERS [x]
    7) Pago, ajustes y transferencias son movimientos financieros que tienen los mismos atributos pero distintas descripciones y categorias
    (Borrar entidades, y crear entidad mov financiero) [X]
    8) Crear operaciones de pago, transferencia y ajuste de caja []
    9) Arreglar las operaciones de arriba para el caja service []
    10) Cada usuario debe tener su proveedor, pedido y mov financiero []
    11) Agregar entidad base con relacion disyunda en el modelo de dominio []



    12) Probar editar venta en el front []
    13) probar de actualizar proveedor []
    14) Actualizar linea de pedido []

    11) El frontend debe tener una pagina con los movimientos de la empresa y ahi filtrar por tipo de movimiento, como en cashflow []

    8) Arreglar como se calculan los reportes (ver listado y detalles github) []
    9) Revisar que funcionen todos los http []
    7) Escribir test unitarios e integradores []
    10) Actualizar el propousal []
    11) Desplegar en Render []
*/
