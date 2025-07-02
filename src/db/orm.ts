import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import dotenv from "dotenv";

dotenv.config();

export const orm = await MikroORM.init<PostgreSqlDriver>({
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