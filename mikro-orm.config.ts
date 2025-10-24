import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import dotenv from 'dotenv';
dotenv.config();

const config: Options<PostgreSqlDriver> = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['./dist/src/entities/**/*.entities.js'],
  entitiesTs: ['./src/entities/**/*.entities.ts'],
  clientUrl: process.env.DATABASE_URL,
  highlighter: new SqlHighlighter(),
  driver: PostgreSqlDriver,
  debug: process.env.NODE_ENV === 'development',
  schemaGenerator: { 
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
  migrations: {
    path: './dist/src/migrations',          // Ruta donde se guardarán las migraciones compiladas
    pathTs: './src/migrations',            // Ruta para archivos TypeScript de migraciones
    glob: '!(*.d).{js,ts}',                // Patrón para encontrar archivos de migración
    transactional: true,                   // Ejecutar migraciones en transacciones
    disableForeignKeys: false,             // No deshabilitar foreign keys durante migraciones
    allOrNothing: true,                    // Revertir todas las migraciones si una falla
    dropTables: false,                     // No eliminar tablas automáticamente
    safe: false,                           // Permitir migraciones destructivas
    snapshot: true,                        // Crear snapshot del esquema
    emit: 'ts',                            // Generar migraciones en TypeScript
    generator: TSMigrationGenerator,       // Usar generador de TypeScript
  }
}

export default config;
