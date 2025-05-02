import express from 'express';
import router from './routes/clienteRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/clientes', router);

app.get('/', (req, res) => {
  res.send('<h1>Velzia</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
