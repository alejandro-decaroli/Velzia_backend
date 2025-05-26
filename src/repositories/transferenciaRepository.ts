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

  async create({ IDCajaOrigen, IDCajaDestino, monto }: { IDCajaOrigen: number; IDCajaDestino: number; monto: number }) {
    const cajOg = await cajaRepository.getById(IDCajaOrigen);
    const cajDe = await cajaRepository.getById(IDCajaDestino);
    if (!cajOg) {
      throw new Error ('Caja de origen no encontrada');
    }
    else if (!cajDe) {
      throw new Error ('Caja de destino no encontrada');
    }
    const res = await db.query(
      'INSERT INTO transferencia (IDCajaOrigen, IDCajaDestino, monto) VALUES ($1, $2, $3) RETURNING *',
      [IDCajaOrigen, IDCajaDestino, monto]
    );
    return res.rows[0];
  },

  async update(id: number, { IDCajaOrigen, IDCajaDestino, monto }: { IDCajaOrigen: number; IDCajaDestino: number; monto: number }) {
    const res = await db.query(
      'UPDATE transferencia SET IDCajaOrigen = $1, IDCajaDestino = $2, monto = $3 WHERE id = $4 RETURNING *',
      [IDCajaOrigen, IDCajaDestino, monto, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM transferencia WHERE id = $1', [id]);
  }
};

export default transferenciaRepository;