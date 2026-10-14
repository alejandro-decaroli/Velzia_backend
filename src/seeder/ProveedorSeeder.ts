import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Proveedor } from '../entities/Proveedor.entities.js';
import { Usuario } from '../entities/Usuario.entities.js';

export class ProveedorSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuario = await em.findOne(Usuario, { id: 1 });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const proveedores = await em.find(Proveedor, {});
    if (proveedores.length > 0) {
      return;
    }

    await em.insertMany(Proveedor, [
      {
        cod: 'PR_1',
        razon_social: 'Distribuidora Frutihortícola Central S.A.',
        cuit: '30-71123456-8',
        telefono: '011-4567-8901',
        email: 'ventas@frutihorticola.com',
        direccion: 'Av. Mercado Central 1200, Buenos Aires',
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'PR_2',
        razon_social: 'Agropecuaria San Isidro S.R.L.',
        cuit: '30-68987654-2',
        telefono: '0341-4890123',
        email: 'contacto@agrosanisidro.com.ar',
        direccion: 'Ruta 9 Km 280, Rosario',
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'PR_3',
        razon_social: 'Comercializadora de Frutas Tropicales S.A.',
        cuit: '33-70554433-9',
        telefono: '0379-4455667',
        email: 'info@frutastropicales.com',
        direccion: 'Av. Independencia 3450, Corrientes',
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'PR_4',
        razon_social: 'Empaques y Logística del Litoral S.A.',
        cuit: '30-71445566-1',
        telefono: '0342-4567890',
        email: 'logistica@empaqueslitoral.com',
        direccion: 'Parque Industrial Lote 14, Santa Fe',
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
      {
        cod: 'PR_5',
        razon_social: 'Insumos Agrícolas y Cítricos del Norte S.R.L.',
        cuit: '30-69887766-5',
        telefono: '0381-4234567',
        email: 'ventas@citricosnorte.com.ar',
        direccion: 'Av. Circunvalación 890, Tucumán',
        usuario: usuario,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
    ]);
  }
}
