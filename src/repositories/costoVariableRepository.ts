import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import clienteRepository from './clienteRepository.js';
import ventaRepository from './ventaRepository.js';
import monedaRepository from './monedaRepository.js';
import httpErrors from 'http-errors';
const { NotFound } = httpErrors;

const costoVariableRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM costo_variable ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM costo_variable WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ cliente_id, caja_id, adjudicacion, monto, moneda_id, venta_id }: { cliente_id: number; caja_id: number; adjudicacion: string, monto: number, moneda_id: number, venta_id: number }) {
    const cli = await clienteRepository.getById(cliente_id);
    const caj = await cajaRepository.getById(caja_id);
    const venta = await ventaRepository.getById(venta_id);
    const moneda = await monedaRepository.getById(moneda_id);
    if (!cli) {
      throw new NotFound ('Cliente no encontrado');
    }
    if (!caj) {
      throw new NotFound('Caja no encontrada');
    }    
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }    
    if (!venta) {
      throw new NotFound('Venta no encontrada');
    }    
    const res = await db.query(
      'INSERT INTO costo_variable (cliente_id, caja_id, adjudicacion, monto, moneda_id, venta_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cliente_id, caja_id, adjudicacion, monto, moneda_id, venta_id]
    );
    return res.rows[0];
  },

  async update(id: number, { cliente_id, caja_id, adjudicacion, monto, moneda_id, venta_id }: { cliente_id: number; caja_id: number; adjudicacion: string, monto: number, moneda_id: number, venta_id: number }) {
    const cli = await clienteRepository.getById(cliente_id);
    const caj = await cajaRepository.getById(caja_id);
    const moneda = await monedaRepository.getById(moneda_id);
    const venta = await ventaRepository.getById(venta_id);
    if (!cli) {
      throw new NotFound ('Cliente no encontrado');
    }
    if (!caj) {
      throw new NotFound('Caja no encontrada');
    }    
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }    
    if (!venta) {
      throw new NotFound('Venta no encontrada');
    }    
    const res = await db.query(
      'UPDATE costo_variable SET cliente_id = $1, caja_id = $2, adjudicacion = $3, monto = $4, moneda_id = $5, venta_id = $6 WHERE id = $7 RETURNING *',
      [cliente_id, caja_id, adjudicacion, monto, moneda_id, venta_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await db.query('SELECT * FROM costo_variable WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Costo variable no encontrado');
    }
    await db.query('DELETE FROM costo_variable WHERE id = $1', [id]);
  }
};

export default costoVariableRepository;