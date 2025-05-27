import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';

const transferenciaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM transferencia ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM transferencia WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_origen_id, caja_destino_id, monto }: { caja_origen_id: number; caja_destino_id: number; monto: number }) {
    const cajOg = await cajaRepository.getById(caja_origen_id);
    const cajDe = await cajaRepository.getById(caja_destino_id);
    if (!cajOg) {
      throw new Error ('Caja de origen no encontrada');
    }
    else if (!cajDe) {
      throw new Error ('Caja de destino no encontrada');
    }
    const res = await db.query(
      'INSERT INTO transferencia (caja_origen_id, caja_destino_id, monto) VALUES ($1, $2, $3) RETURNING *',
      [caja_origen_id, caja_destino_id, monto]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_origen_id, caja_destino_id, monto }: { caja_origen_id: number; caja_destino_id: number; monto: number }) {
    const res = await db.query(
      'UPDATE transferencia SET caja_origen_id = $1, caja_destino_id = $2, monto = $3 WHERE id = $4 RETURNING *',
      [caja_origen_id, caja_destino_id, monto, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM transferencia WHERE id = $1', [id]);
  }
};

export default transferenciaRepository;