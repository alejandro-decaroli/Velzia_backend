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
app.use('/costo_fijos', costoFijoRouter);
app.use('/costo_variables', costoVariableRouter);
app.use('/ajustes', ajusteRouter);
app.use('/aportes_socio', aporteSocioRouter);
app.use('/dividendos_socio', dividendoSocioRouter);
app.use('/transferencias', transferenciaRouter);
app.use('/tasas', tasaRouter);

// Middleware de manejo de errores
// app.use(errorHandler as express.ErrorRequestHandler);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})

// Implementar eliminado lógico (soft delete)
// Que se abra en el navegador para Ivan

// implementar devolucion de codigos
// socket hang out al intentar crear un ajuste con una caja que no existe