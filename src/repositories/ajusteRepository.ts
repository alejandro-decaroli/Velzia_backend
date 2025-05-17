import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';

const ajusteRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM ajuste ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM ajuste WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto, movimiento }: { caja_id: number; monto: number; movimiento: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO ajuste (caja_id, monto, movimiento) VALUES ($1, $2, $3) RETURNING *',
      [caja_id, monto, movimiento]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, movimiento }: { caja_id: number; monto: number; movimiento: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE ajuste SET caja_id = $1, monto = $2, movimiento = $3 WHERE id = $4 RETURNING *',
      [caja_id, monto, movimiento, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM ajuste WHERE id = $1', [id]);
  }
};

export default ajusteRepository;