import { orm } from '../db/orm.js';
import { Caja } from '../entities/Caja.entities.js';
import { MovF } from '../entities/MovF.entities.js';
import createError from 'http-errors';
import { Usuario } from '../entities/Usuario.entities.js';
const { BadRequest, NotFound, Conflict } = createError;

const em = orm.em;

export async function getAllCajas(userId: number, fecha: string) {
  if (!fecha) {
    return await em.find(Caja, {usuario: userId});
  }

  const fechaDate = new Date(fecha.split('T')[0]);
  const inicioMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const finMes = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const cajas = await em.find(Caja, {usuario: userId, creadoEn: { $gte: inicioMes, $lte: finMes }});
  return cajas;
}

export async function getByIdCaja(userId:any, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  return caja;
}

export async function createCaja(data:any, userId:number) {
  const name = data.nombre;
  const monto = data.monto;
  const nombre_duplicado = await em.findOne(Caja, { nombre: name, usuario: userId });
  if (nombre_duplicado) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  const usuario = await em.findOne(Usuario, {id: userId});
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }
  let codigo: string;
  const cajas = await em.find(Caja, {usuario: userId});
  const cajaConCodigoMasGrande = cajas.length
  ? cajas.reduce((max, caja) =>
      Number(caja.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? caja : max
    )
  : '1';
  if (cajaConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(cajaConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }
  await em.create(Caja, {
    cod: 'CA_' + codigo,
    nombre: name,
    monto: monto,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });
  await em.flush();
}

export async function updateCaja(data:any, userId: number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }
  const monto_anterior = caja.monto;
  const nombre_duplicado = await em.findOne(Caja, { nombre: data.nombre, usuario: userId });
  if (nombre_duplicado && nombre_duplicado.id !== id) {
    throw new Conflict('Las cajas no pueden tener el mismo nombre');
  }
  caja.nombre = data.nombre;
  caja.monto = data.monto;
  caja.actualizadoEn = new Date();
  await em.flush();
}

export async function removeCaja(userId:number, id:number) {
  if (isNaN(id)) {
    throw new BadRequest('El ID no puede ser nulo');
  }
  const caja = await em.findOne(Caja, {id: id, usuario: userId});
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  await em.removeAndFlush(caja);
}

export async function realizarTransferencia(data: any, userId: number) {
  const caja_origen_id = Number(data.caja_origen || data.caja_origen_id || data.cajaOrigen);
  const caja_destino_id = Number(data.caja_destino || data.caja_destino_id || data.cajaDestino);
  const monto = Number(data.monto);

  if (isNaN(caja_origen_id) || isNaN(caja_destino_id)) {
    throw new BadRequest('Caja de origen y caja de destino son requeridas');
  }

  if (caja_origen_id === caja_destino_id) {
    throw new BadRequest('Caja de origen y caja de destino no pueden ser iguales');
  }

  if (isNaN(monto) || monto <= 0) {
    throw new BadRequest('El monto a transferir debe ser mayor a 0');
  }

  const caja_origen = await em.findOne(Caja, { id: caja_origen_id, usuario: userId });
  if (!caja_origen) {
    throw new NotFound('Caja de origen no encontrada');
  }

  const caja_destino = await em.findOne(Caja, { id: caja_destino_id, usuario: userId });
  if (!caja_destino) {
    throw new NotFound('Caja de destino no encontrada');
  }

  if (Number(caja_origen.monto) < monto) {
    throw new BadRequest('La caja de origen no cuenta con fondos suficientes para transferir');
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  // Actualizar saldos de las cajas
  caja_origen.monto = Number(caja_origen.monto) - monto;
  caja_destino.monto = Number(caja_destino.monto) + monto;
  caja_origen.actualizadoEn = new Date();
  caja_destino.actualizadoEn = new Date();

  // Generar código para MovF
  let codigo: string;
  const arrayPagos = await em.find(MovF, { usuario: userId });
  const pagoConCodigoMasGrande = arrayPagos.length
    ? arrayPagos.reduce((max, pago) =>
        Number(pago.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? pago : max
      )
    : '1';
  if (pagoConCodigoMasGrande === '1') {
    codigo = '1';
  } else {
    codigo = String(Number(pagoConCodigoMasGrande.cod?.split('_')[1]) + 1);
  }

  // Crear MovF asociado a la transferencia (Tipo 'Transferencia' ya que no constituye ni un ingreso ni un egreso del sistema)
  const movF = em.create(MovF, {
    caja: caja_origen,
    monto: monto,
    cod: 'TR_' + codigo,
    tipo: 'Transferencia',
    categoria: 'transferencia',
    descripcion: data.descripcion || `Transferencia de ${caja_origen.nombre} a ${caja_destino.nombre}`,
    usuario: usuario,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  });

  await em.persistAndFlush([caja_origen, caja_destino, movF]);

  return {
    caja_origen,
    caja_destino,
    movF
  };
}

export async function obtenerConciliacion(userId: number, cajaId?: number) {
  if (cajaId) {
    if (isNaN(cajaId)) {
      throw new BadRequest('ID de caja inválido');
    }
    const caja = await em.findOne(Caja, { id: cajaId, usuario: userId });
    if (!caja) {
      throw new NotFound('Caja no encontrada');
    }
    return {
      caja_id: caja.id,
      nombre: caja.nombre,
      monto_sistema: Number(caja.monto)
    };
  }

  const cajas = await em.find(Caja, { usuario: userId });
  return cajas.map(c => ({
    caja_id: c.id,
    nombre: c.nombre,
    monto_sistema: Number(c.monto)
  }));
}

export async function realizarConciliacion(data: any, userId: number, cajaId?: number) {
  const id = Number(cajaId || data.caja_id || data.cajaId || data.caja);
  if (isNaN(id)) {
    throw new BadRequest('ID de caja no proporcionado o inválido');
  }

  const caja = await em.findOne(Caja, { id: id, usuario: userId });
  if (!caja) {
    throw new NotFound('Caja no encontrada');
  }

  const monto_fisico = Number(data.monto_fisico ?? data.monto_real ?? data.montoFisico);
  if (isNaN(monto_fisico) || monto_fisico < 0) {
    throw new BadRequest('El monto físico debe ser un número mayor o igual a 0');
  }

  const usuario = await em.findOne(Usuario, { id: userId });
  if (!usuario) {
    throw new NotFound('Usuario no encontrado');
  }

  const monto_sistema = Number(caja.monto);
  const diferencia = Number((monto_fisico - monto_sistema).toFixed(4));
  const monto_ajuste = Math.abs(diferencia);

  caja.monto = monto_fisico;
  caja.actualizadoEn = new Date();

  let movF: MovF | null = null;

  if (diferencia !== 0) {
    let codigo: string;
    const arrayPagos = await em.find(MovF, { usuario: userId });
    const pagoConCodigoMasGrande = arrayPagos.length
      ? arrayPagos.reduce((max, pago) =>
          Number(pago.cod?.split('_')[1]) > Number(max.cod?.split('_')[1]) ? pago : max
        )
      : '1';
    if (pagoConCodigoMasGrande === '1') {
      codigo = '1';
    } else {
      codigo = String(Number(pagoConCodigoMasGrande.cod?.split('_')[1]) + 1);
    }

    const tipo = diferencia > 0 ? 'Ingreso' : 'Egreso';
    const descripcion = data.descripcion || (
      diferencia > 0 
        ? `Ajuste positivo por conciliación en ${caja.nombre} (+${monto_ajuste})` 
        : `Ajuste negativo por conciliación en ${caja.nombre} (-${monto_ajuste})`
    );

    movF = em.create(MovF, {
      caja: caja,
      monto: monto_ajuste,
      cod: 'AJ_' + codigo,
      tipo: tipo,
      categoria: 'Ajuste',
      descripcion: descripcion,
      usuario: usuario,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    });

    await em.persistAndFlush([caja, movF]);
  } else {
    await em.persistAndFlush(caja);
  }

  return {
    caja,
    monto_sistema,
    monto_fisico,
    diferencia,
    monto_ajuste,
    movF
  };
}