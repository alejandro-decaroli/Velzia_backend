import db from '../config/db.js';
import httpErrors from 'http-errors';
const { NotFound } = httpErrors;

const monedaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM moneda ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM moneda WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Moneda no encontrada');
    }
    return res.rows[0];
  },

  async create({ nombre, codigo_iso }: { nombre: string; codigo_iso: string }) {
    const res = await db.query(
      'INSERT INTO moneda (nombre, codigo_iso) VALUES ($1, $2) RETURNING *',
      [nombre, codigo_iso]
    );
    if (res.rows.length === 0) {
      throw new NotFound('Moneda no encontrada');
    }
    return res.rows[0];
  },

  async update(id: number, { nombre, codigo_iso }: { nombre: string; codigo_iso: string }) {
    const res = await db.query(
      'UPDATE moneda SET nombre = $1, codigo_iso = $2 WHERE id = $3 RETURNING *',
      [nombre, codigo_iso, id]
    );
    if (res.rows.length === 0) {
      throw new NotFound('Moneda no encontrada');
    }
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await this.getById(id);
    if (!res) {
      throw new NotFound('Moneda no encontrada');
    }
    await db.query('DELETE FROM moneda WHERE id = $1', [id]);
  }
};

export default monedaRepository;