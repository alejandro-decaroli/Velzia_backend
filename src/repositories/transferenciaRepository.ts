import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import monedaRepository from './monedaRepository.js';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const transferenciaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM transferencia ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM transferencia WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_origen_id, caja_destino_id, monto, moneda_id }: { caja_origen_id: number; caja_destino_id: number; monto: number, moneda_id: number }) {
    const cajOg = await cajaRepository.getById(caja_origen_id);
    const cajDe = await cajaRepository.getById(caja_destino_id);
    const moneda = await monedaRepository.getById(moneda_id);
    if (!cajOg) {
      throw new NotFound('Caja de origen no encontrada');
    }
    else if (!cajDe) {
      throw new NotFound ('Caja de destino no encontrada');
    }
    else if (!moneda) {
      throw new NotFound ('Moneda no encontrada');
    }
    const res = await db.query(
      'INSERT INTO transferencia (caja_origen_id, caja_destino_id, monto, moneda_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caja_origen_id, caja_destino_id, monto, moneda_id]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_origen_id, caja_destino_id, monto, moneda_id }: { caja_origen_id: number; caja_destino_id: number; monto: number, moneda_id: number }) {
    const res = await db.query(
      'UPDATE transferencia SET caja_origen_id = $1, caja_destino_id = $2, monto = $3, moneda_id = $4 WHERE id = $5 RETURNING *',
      [caja_origen_id, caja_destino_id, monto, moneda_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const transferencia = await transferenciaRepository.getById(id);
    if (!transferencia) {
      throw new NotFound('Transferencia no encontrada');
    }    
    await db.query('DELETE FROM transferencia WHERE id = $1', [id]);
  }
};

export default transferenciaRepository;