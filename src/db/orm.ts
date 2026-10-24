import { MikroORM } from "@mikro-orm/core";
import { MainSeeder } from '../seeder/MainSeeder.js';
import dotenv from "dotenv";
import config from "../../mikro-orm.config.js";

dotenv.config();

export const orm = await MikroORM.init(config);

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    try {
        const em = orm.em.fork();
        await em.nativeUpdate('MovF', { categoria: 'transferencia' }, { tipo: 'Transferencia' });
    } catch {
        // En caso de que no exista aún la tabla
    }
}

export const seed = async () => {
    const seeder = orm.getSeeder();
    await seeder.seed(MainSeeder);
}