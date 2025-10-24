import { MikroORM } from "@mikro-orm/core";
import { MainSeeder } from '../seeder/MainSeeder.js';
import dotenv from "dotenv";
import config from "../../mikro-orm.config.js";

dotenv.config();

export const orm = await MikroORM.init(config);

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}

export const seed = async () => {
    const seeder = orm.getSeeder();
    await seeder.seed(MainSeeder);
}