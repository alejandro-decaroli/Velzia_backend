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

  async create({ caja_id, monto, moneda_id, aporte }: { caja_id: number; monto: number; moneda_id: number, aporte: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO aporte_socio (caja_id, monto, moneda_id, aporte) VALUES ($1, $2, $3, $4) RETURNING *',
      [caja_id, monto, moneda_id, aporte]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, moneda_id, aporte }: { caja_id: number; monto: number; moneda_id: number, aporte: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE aporte_socio SET caja_id = $1, monto = $2, moneda_id = $3, aporte = $4 WHERE id = $5 RETURNING *',
      [caja_id, monto, moneda_id, aporte, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM aporte_socio WHERE id = $1', [id]);
  }
};

export default aporteSocioRepository;