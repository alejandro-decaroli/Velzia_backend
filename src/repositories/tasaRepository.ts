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

  async create({ tasa_actual, tasa_nueva}: { tasa_actual: number; tasa_nueva: number }) {
    const res = await db.query(
      'INSERT INTO cliente (tasa_actual, tasa_nueva) VALUES ($1, $2, $3) RETURNING *',
      [tasa_actual, tasa_nueva]
    );
    return res.rows[0];
  },

  async update(id: number, { tasa_actual, tasa_nueva}: { tasa_actual: number; tasa_nueva: number }) {
    const res = await db.query(
      'UPDATE cliente SET tasa_actual = $1, tasa_nueva = $2= $3 WHERE id = $4 RETURNING *',
      [tasa_actual, tasa_nueva, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM cliente WHERE id = $1', [id]);
  }
};

export default clienteRepository;