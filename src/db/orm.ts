import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MainSeeder } from '../seeder/MainSeeder.js';
import dotenv from "dotenv";

dotenv.config();

export const orm = await MikroORM.init<PostgreSqlDriver>({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    entities: ["dist/**/*.entities.js"],
    entitiesTs: ["src/**/*.entities.ts"],
    clientUrl: process.env.DATABASE_URL,
    highlighter: new SqlHighlighter(),
    driver: PostgreSqlDriver,
    debug: true,
    schemaGenerator: { // no utilizar en produccion
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    }
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}

export const seed = async () => {
    const seeder = orm.getSeeder();
    await seeder.seed(MainSeeder);
}