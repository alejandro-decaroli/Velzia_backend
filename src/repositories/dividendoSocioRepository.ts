import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import httpErrors from 'http-errors';
const { NotFound } = httpErrors;

const dividendoSocioRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM dividendo_socio ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM dividendo_socio WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto, dividendo, moneda_id }: { caja_id: number; monto: number; dividendo: string; moneda_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO dividendo_socio (caja_id, monto, dividendo, moneda_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caja_id, monto, dividendo, moneda_id]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, dividendo, moneda_id }: { caja_id: number; monto: number; dividendo: string; moneda_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE dividendo_socio SET caja_id = $1, monto = $2, dividendo = $3, moneda_id = $4 WHERE id = $5 RETURNING *',
      [caja_id, monto, dividendo, moneda_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await db.query('SELECT * FROM dividendo_socio WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Dividendo socio no encontrado');
    }
    await db.query('DELETE FROM dividendo_socio WHERE id = $1', [id]);
  }
};

export default dividendoSocioRepository;