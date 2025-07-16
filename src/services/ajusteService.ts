import { orm } from '../db/orm.js';
import { Ajuste } from '../entities/Ajuste.entities.js';
import { Moneda } from '../entities/Moneda.entities.js';
import { Caja } from '../entities/Caja.entities.js';

const em = orm.em;

export async function getAll() {
  const ajustes = em.find(Ajuste, {});
  return ajustes;
}

export async function getById(data:any, id:number) {

  if (isNaN(id)) {
  //return res.status(400).json({ message: 'ID inválido' });
  //devuelvo error 400 con http errors.
  } 

  const ajuste = await em.findOne(Ajuste, id);
  if (!ajuste) {
    //return res.status(404).json({ message: 'Ajuste no encontrado' });
    //devuelvo error 404 con http errors.
  }

  //pasa las validaciones entonces devuelvo el ajuste encontrado.
}