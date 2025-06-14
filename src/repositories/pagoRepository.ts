import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import monedaRepository from './monedaRepository.js';
import ventaRepository from './ventaRepository.js';
import httpErrors from 'http-errors';
const { NotFound } = httpErrors;

const pagoRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM pago ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM pago WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ caja_id, monto, moneda_id, venta_id }: { caja_id: number; monto: number; moneda_id: number; venta_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    const moneda = await monedaRepository.getById(moneda_id);
    const venta = await ventaRepository.getById(venta_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }
    if (!venta) {
      throw new NotFound('Venta no encontrada');
    }
    const res = await db.query(
      'INSERT INTO pago (caja_id, monto, moneda_id, venta_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caja_id, monto, moneda_id, venta_id]
    );
    return res.rows[0];
  },

  async update(id: number, { caja_id, monto, moneda_id, venta_id }: { caja_id: number; monto: number; moneda_id: number; venta_id: number }) {
    const caja = await cajaRepository.getById(caja_id);
    const moneda = await monedaRepository.getById(moneda_id);
    const venta = await ventaRepository.getById(venta_id);
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }
    if (!venta) {
      throw new NotFound('Venta no encontrada');
    }
    const res = await db.query(
      'UPDATE pago SET caja_id = $1, monto = $2, moneda_id = $3, venta_id = $4 WHERE id = $5 RETURNING *',
      [caja_id, monto, moneda_id, venta_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await this.getById(id);
    if (!res) {
      throw new NotFound('Pago no encontrado');
    }
    await db.query('DELETE FROM pago WHERE id = $1', [id]);
  }
};

export default pagoRepository;