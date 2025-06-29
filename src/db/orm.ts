import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export let orm: MikroORM<PostgreSqlDriver>;

export const initORM = async () => {
    orm = await MikroORM.init<PostgreSqlDriver>({
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
    });

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
};
