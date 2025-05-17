import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';

const aporteSocioRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM aporte_socio ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM aporte_socio WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto }: { caja_id: number; monto: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO aporte_socio (caja_id, monto) VALUES ($1, $2) RETURNING *',
      [caja_id, monto]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto }: { caja_id: number; monto: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE aporte_socio SET caja_id = $1, monto = $2 WHERE id = $3 RETURNING *',
      [caja_id, monto, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM aporte_socio WHERE id = $1', [id]);
  }
};

export default aporteSocioRepository;