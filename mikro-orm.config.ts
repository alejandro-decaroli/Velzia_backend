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
    path: './dist/src/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
  }
}

export default config;
