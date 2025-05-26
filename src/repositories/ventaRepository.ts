import { error } from 'console';
import db from '../config/db.js';
import clienteRepository from './clienteRepository.js';

const ventaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM venta ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM venta WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ cliente_id, valor_pesos, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, valor_usd }: { cliente_id: number; valor_pesos: number; costo_mano_obra: number, costo_materiales_viaticos_fletes: number, costo_comision: number, valor_usd: string }) {
    const cli = await clienteRepository.getById(cliente_id);
    if (!cli) {
      throw new Error ('Cliente no encontrado');
    }
    const res = await db.query(
      'INSERT INTO venta (cliente_id = $1, valor_pesos = $2, costo_mano_obra = $3, costo_materiales_viaticos_fletes = $4, costo_comision = $5, valor_usd = $6 WHERE id = $7 RETURNING *',
      [cliente_id, valor_pesos, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, valor_usd]
    );
    return res.rows[0];
  },

  async update(id: number, { cliente_id, valor_pesos, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, valor_usd }: { cliente_id: number; valor_pesos: number; costo_mano_obra: number, costo_materiales_viaticos_fletes: number, costo_comision: number, valor_usd: string }) {
    const cli = await clienteRepository.getById(cliente_id);
    if (!cli) {
      throw new Error ('Cliente no encontrado');
    }    
    const res = await db.query(
      'UPDATE venta SET cliente_id = $1, valor_pesos = $2, costo_mano_obra = $3, costo_materiales_viaticos_fletes = $4, costo_comision = $5, valor_usd = $6 WHERE id = $7 RETURNING *',
      [cliente_id, valor_pesos, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, valor_usd, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM venta WHERE id = $1', [id]);
  }
};

export default ventaRepository;