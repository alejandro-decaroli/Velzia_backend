import db from '../config/db.js';

const cajaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM caja ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM caja WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ nombre, tipo}: { nombre: string; tipo:string}) {
    const res = await db.query(
      'INSERT INTO caja (nombre, tipo) VALUES ($1, $2) RETURNING *',
      [nombre, tipo]
    );
    return res.rows[0];
  },

  async update(id: number, { nombre, tipo }: { nombre: string; tipo: string}) {
    const res = await db.query(
      'UPDATE caja SET nombre = $1, tipo = $2 WHERE id = $3 RETURNING *',
      [nombre, tipo, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM caja WHERE id = $1', [id]);
  }
};

export default cajaRepository;