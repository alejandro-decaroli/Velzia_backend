import express from "express";
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
import dotenv from "dotenv";
import { Request, Response } from "express";
import monedaRouter from "./routes/monedaRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>ESTO es VELZIA!</h1>");
})

// Prefijos para las rutas
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

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})

// Implementar eliminado lógico (soft delete)
// Que se abra en el navegador para Ivan

// TODO: si se borra una caja se borran todas las entidades relacionadas a ella,
// que hacer??