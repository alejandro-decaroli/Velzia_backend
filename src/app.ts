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

app.use(express.json()); // middleware para parsear el body de las peticiones

app.use('/cajas', cajaRouter);


app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>ESTO es VELZIA!</h1>");
})

// Prefijos para las rutas
app.use('/clientes', clienteRouter); // antepone /clientes a todas las rutas de clienteRouter
app.use('/cajas', cajaRouter); // antepone /cajas a todas las rutas de cajaRouter
app.use('/pagos', pagoRouter); // antepone /pagos a todas las rutas de pagoRouter
app.use('/ventas', ventaRouter); // antepone /ventas a todas las rutas de ventaRouter
app.use('/costo_fijos', costoFijoRouter); // antepone /costo_fijos a todas las rutas de costoFijoRouter
app.use('/costo_variables', costoVariableRouter); // antepone /costo_variables a todas las rutas de costoVariableRouter
app.use('/ajustes', ajusteRouter); // antepone /ajustes a todas las rutas de ajusteRouter
app.use('/aportes_socio', aporteSocioRouter); // antepone /aportes_socio a todas las rutas de aporteSocioRouter
app.use('/dividendos_socio', dividendoSocioRouter); // antepone /dividendos_socio a todas las rutas de dividendoSocioRouter
app.use('/transferencias', transferenciaRouter); // antepone /transferencias a todas las rutas de transferenciaRouter
app.use('/tasas', tasaRouter); // antepone /tasas a todas las rutas de tasaRouter

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})

// Averiguar flyway desde hice-pack
// Implementar eliminado lógico (soft delete)
// Que se abra en el navegador para Ivan