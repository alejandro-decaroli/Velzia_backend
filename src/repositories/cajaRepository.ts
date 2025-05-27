import db from '../config/db.js';
import httpErrors from 'http-errors';
const { NotFound, BadRequest } = httpErrors;

const cajaRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM caja ORDER BY id;');
    return res.rows;
  },
  async getCajabyNombre(nombre: string) {
    const res = await db.query('SELECT * FROM caja WHERE nombre = $1', [nombre]);
    if (res.rows.length === 0) {
      throw new NotFound('Caja no encontrada');
    }
    return res.rows[0];
  },

  async getById(id: number) {
    const res = await db.query('SELECT * FROM caja WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Caja no encontrada');
    }
    return res.rows[0];
  },

  async create({ nombre, tipo }: { nombre: string; tipo: string }) {
    // Verificar si el nombre ya existe
    const existingCaja = await this.getCajabyNombre(nombre);
    
    if (existingCaja) {
      throw new BadRequest('El nombre de la caja ya está en uso');
    }
    const res = await db.query(
      'INSERT INTO caja (nombre, tipo) VALUES ($1, $2) RETURNING *',
      [nombre, tipo]
    );
    return res.rows[0];
  },

  async update(id: number, { nombre, tipo }: { nombre: string; tipo: string }) {
    // Verificar si el nombre ya existe
    const existingCaja = await this.getCajabyNombre(nombre);
    
    if (existingCaja) {
      throw new BadRequest('El nombre de la caja ya está en uso');
    }
    const res = await db.query(
      'UPDATE caja SET nombre = $1, tipo = $2 WHERE id = $3 RETURNING *',
      [nombre, tipo, id]
    );
    return res.rows[0];
  },

  async remove(id: number) {
    const res = await db.query('SELECT * FROM caja WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFound('Caja no encontrada');
    }
    await db.query('DELETE FROM caja WHERE id = $1', [id]);
  }
};

export default cajaRepository;