import db from '../config/db.js';
import monedaRepository from './monedaRepository.js';
import httpErrors from 'http-errors';
import { QueryResult } from 'pg';
const { NotFound, BadRequest } = httpErrors;


const ventaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM venta ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    try {
      const res = await db.query('SELECT * FROM venta WHERE id = $1', [id]);
      return res.rows[0];
    } catch (error) {
      throw new NotFound('Venta no encontrada');
    }
  },

  async create({ 
    monto_ars, 
    costo_mano_obra, 
    costo_materiales_viaticos_fletes, 
    costo_comision, 
    monto_usd,
    moneda_id }: { 
      monto_ars: number; 
      costo_mano_obra: number, 
      costo_materiales_viaticos_fletes: number, 
      costo_comision: number, 
      monto_usd: string,
      moneda_id: number 
    }) {
    const moneda = await monedaRepository.getById(moneda_id);
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }
    const res = await db.query(
      'INSERT INTO venta (monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd, moneda_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd, moneda_id]
    );
    return res.rows[0];
  },

  async update(id: number, { monto_ars, 
    costo_mano_obra, 
    costo_materiales_viaticos_fletes, 
    costo_comision, 
    monto_usd,
    moneda_id }: { 
      monto_ars: number; 
      costo_mano_obra: number, 
      costo_materiales_viaticos_fletes: number, 
      costo_comision: number, 
      monto_usd: string,
      moneda_id: number 
    }) {
    const moneda = await monedaRepository.getById(moneda_id);
    if (!moneda) {
      throw new NotFound('Moneda no encontrada');
    }
    const res = await db.query(
      'UPDATE venta SET monto_ars = $1, costo_mano_obra = $2, costo_materiales_viaticos_fletes = $3, costo_comision = $4, monto_usd = $5, moneda_id = $6 WHERE id = $7 RETURNING *',
      [monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd, moneda_id, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const result: QueryResult = await db.query('DELETE FROM venta WHERE id = $1', [id]);
    return result.rowCount !== 0;
  }
};

export default ventaRepository;