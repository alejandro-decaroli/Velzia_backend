import db from '../config/db.js';
import cajaRepository from './cajaRepository.js';
import clienteRepository from './clienteRepository.js';

const costoVariableRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM costo_variable ORDER BY id;');
    return res.rows;
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM costo_variable WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ cliente_id, caja_id, adjudicacion, monto }: { cliente_id: number; caja_id: number; adjudicacion: string, monto: number }) {
    const cli = await clienteRepository.getById(cliente_id);
    const caj = await cajaRepository.getById(caja_id);
    if (!cli) {
      throw new Error ('Cliente no encontrado');
    }
    if (!caj) {
      throw new Error('Caja no encontrada');
    }    
    const res = await db.query(
      'INSERT INTO costo_variable (cliente_id, caja_id, adjudicacion, monto) VALUES ($1, $2, $3, $4) RETURNING *',
      [cliente_id, caja_id, adjudicacion, monto]
    );
    return res.rows[0];
  },

  async update(id: number, { cliente_id, caja_id, adjudicacion, monto }: { cliente_id: number; caja_id: number; adjudicacion: string, monto: number }) {
    const res = await db.query(
      'UPDATE costo_variable SET cliente_id = $1, caja_id = $2, adjudicacion = $3, monto = $4 WHERE id = $5 RETURNING *',
      [cliente_id, caja_id, adjudicacion, monto, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    await db.query('DELETE FROM costo_variable WHERE id = $1', [id]);
  }
};

export default costoVariableRepository;