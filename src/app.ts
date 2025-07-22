import express from "express";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema } from "./db/orm.js";
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

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(orm.em, next);   
})

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>ESTO es VELZIA!</h1>");
});

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

await syncSchema();

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})

// TODO: si se borra una caja se borran todas las entidades relacionadas a ella,
// que hacer??

// TODO: probar si al modificar cliente o ventas se actualiza estado de cliente
// TODO: crear una venta para un cliente activo y que no lo permita
// TODO: agregar validacion de distintos id de cajas en transferencias, en Validations (tasas)




