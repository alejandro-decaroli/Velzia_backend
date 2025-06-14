import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import httpErrors from 'http-errors';
const { NotFound } = httpErrors;

const costoFijoRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM costo_fijo ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM costo_fijo WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto, adjudicacion, moneda_id }: { caja_id: number; monto: number; adjudicacion: string, moneda_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO costo_fijo (caja_id, monto, adjudicacion, moneda_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caja_id, monto, adjudicacion, moneda_id]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, adjudicacion, moneda_id }: { caja_id: number; monto: number; adjudicacion: string, moneda_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE costo_fijo SET caja_id = $1, monto = $2, adjudicacion = $3 , moneda_id = $4 WHERE id = $5 RETURNING *',
      [caja_id, monto, adjudicacion, moneda_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await db.query('SELECT * FROM costo_fijo WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Costo fijo no encontrado');
    }
    await db.query('DELETE FROM costo_fijo WHERE id = $1', [id]);
  }
};

export default costoFijoRepository;