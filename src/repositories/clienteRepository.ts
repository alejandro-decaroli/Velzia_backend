import db from '../config/db.js';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const clienteRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM cliente ORDER BY id;');
    return res.rows;
  },

  async getAllNames() {
    const res = await db.query('SELECT nombre FROM cliente ORDER BY id;');
    return res.rows;
  },

  async getIdByName(name: string) {
    const res = await db.query('SELECT id FROM cliente WHERE nombre = $1', [name]);
    if (res.rows.length === 0) {
      throw new NotFound('Cliente no encontrado');
    }
    return res.rows[0];
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM cliente WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ nombre, siglas }: { nombre: string; siglas: string }) {
    const res = await db.query(
      'INSERT INTO cliente (nombre, siglas) VALUES ($1, $2) RETURNING *',
      [nombre, siglas]
    );
    return res.rows[0];
  },

  async update(id: number, { nombre, siglas }: { nombre: string; siglas: string }) {
    const res = await db.query(
      'UPDATE cliente SET nombre = $1, siglas = $2 WHERE id = $3 RETURNING *',
      [nombre, siglas, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM cliente WHERE id = $1', [id]);
  }
};

export default clienteRepository;
