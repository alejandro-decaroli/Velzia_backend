import db from '../config/db.js';
import clienteRepository from './clienteRepository.js';
import cajaRepository from './cajaRepository.js';

const pagoRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM pago ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM pago WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ cliente_id, caja_id, monto }: { cliente_id: number; caja_id: number; monto: number }) {
    const cli = await clienteRepository.getById(cliente_id);
    const caja = await cajaRepository.getById(caja_id);
    if (!cli) {
      throw new Error('Cliente no encontrado');
    }
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'INSERT INTO pago (cliente_id, caja_id, monto) VALUES ($1, $2, $3) RETURNING *',
      [cliente_id, caja_id, monto]
    );
    return res.rows[0];
  },

  async update(id: number, { cliente_id, caja_id, monto }: { cliente_id: number; caja_id: number; monto: number }) {
    const cli = await clienteRepository.getById(cliente_id);
    const caja = await cajaRepository.getById(caja_id);
    if (!cli) {
      throw new Error('Cliente no encontrado');
    }
    if (!caja) {
      throw new Error('Caja no encontrada');
    }
    const res = await db.query(
      'UPDATE pago SET cliente_id = $1, caja_id = $2, monto = $3 WHERE id = $4 RETURNING *',
      [cliente_id, caja_id, monto, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM pago WHERE id = $1', [id]);
  }
};

export default pagoRepository;
