import db from '../config/db.js';

const clienteRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM cliente ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM cliente WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ nombre, estado, siglas }: { nombre: string; estado: string; siglas: string }) {
    const res = await db.query(
      'INSERT INTO cliente (nombre, estado, siglas) VALUES ($1, $2, $3) RETURNING *',
      [nombre, estado, siglas]
    );
    return res.rows[0];
  },

  async update(id: number, { nombre, estado, siglas }: { nombre: string; estado: string; siglas: string }) {
    const res = await db.query(
      'UPDATE cliente SET nombre = $1, estado = $2, siglas = $3 WHERE id = $4 RETURNING *',
      [nombre, estado, siglas, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM cliente WHERE id = $1', [id]);
  }
};

export default clienteRepository;