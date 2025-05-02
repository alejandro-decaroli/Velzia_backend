import express from "express";
import router from "./routes/clienteRoutes.js";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/clientes', router);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("<h1>ESTO es VELZIA!</h1>");
})

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})