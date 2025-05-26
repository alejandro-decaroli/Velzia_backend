import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';

const costoFijoRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM costo_fijo ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM costo_fijo WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto, adjudicacion }: { caja_id: number; monto: number; adjudicacion: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO costo_fijo (caja_id, monto, adjudicacion) VALUES ($1, $2, $3) RETURNING *',
      [caja_id, monto, adjudicacion]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, adjudicacion }: { caja_id: number; monto: number; adjudicacion: string }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE costo_fijo SET caja_id = $1, monto = $2, adjudicacion = $3 WHERE id = $4 RETURNING *',
      [caja_id, monto, adjudicacion, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM costo_fijo WHERE id = $1', [id]);
  }
};

export default costoFijoRepository;