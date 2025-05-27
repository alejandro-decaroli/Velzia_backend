import db from '../config/db.js';
import clienteRepository from './clienteRepository.js';
import httpErrors from 'http-errors';
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

  async create({ cliente_id, monto_ars, 
    costo_mano_obra, 
    costo_materiales_viaticos_fletes, 
    costo_comision, 
    monto_usd }: { 
      cliente_id: number; 
      monto_ars: number; 
      costo_mano_obra: number, 
      costo_materiales_viaticos_fletes: number, 
      costo_comision: number, 
      monto_usd: string 
    }) {
    const cli = await clienteRepository.getById(cliente_id);
    if (!cli) {
      throw new NotFound ('Cliente no encontrado');
    }
    const res = await db.query(
      'INSERT INTO venta (cliente_id, monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cliente_id, monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd]
    );
    return res.rows[0];
  },

  async update(id: number, { cliente_id, monto_ars, 
    costo_mano_obra, 
    costo_materiales_viaticos_fletes, 
    costo_comision, 
    monto_usd }: { 
      cliente_id: number; 
      monto_ars: number; 
      costo_mano_obra: number, 
      costo_materiales_viaticos_fletes: number, 
      costo_comision: number, 
      monto_usd: string 
    }) {
    const cli = await clienteRepository.getById(cliente_id);
    if (!cli) {
      throw new Error ('Cliente no encontrado');
    }    
    const res = await db.query(
      'UPDATE venta SET cliente_id = $1, monto_ars = $2, costo_mano_obra = $3, costo_materiales_viaticos_fletes = $4, costo_comision = $5, monto_usd = $6 WHERE id = $7 RETURNING *',
      [cliente_id, monto_ars, costo_mano_obra, costo_materiales_viaticos_fletes, costo_comision, monto_usd, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM venta WHERE id = $1', [id]);
  }
};

export default ventaRepository;