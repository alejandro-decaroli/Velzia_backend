import { Seeder } from "@mikro-orm/seeder";
import { UserSeeder } from "./UserSeeder.js";
import { EntityManager } from "@mikro-orm/core";
import { ClienteSeeder } from "./ClienteSeeder.js";
import { CajaSeeder } from "./CajaSeeder.js";
import { TransferenciaSeeder } from "./TransSeeder.js";
import { AjusteSeeder } from "./AjusteSeeder.js";
import { ProductoSeeder } from "./ProductoSeeder.js";
import { VentaSeeder } from "./VentasSeeder.js";
import { PagoSeeder } from "./PagoSeeder.js";
import { DetalleSeeder } from "./DetallesSeeder.js";
import { CostoFijoSeeder } from "./CostoFijoSeeder.js";

export class MainSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const userSeeder = new UserSeeder();
        await userSeeder.run(em);
        const clienteSeeder = new ClienteSeeder();
        await clienteSeeder.run(em);
        const cajaSeeder = new CajaSeeder();
        await cajaSeeder.run(em);
        const transferenciaSeeder = new TransferenciaSeeder();
        await transferenciaSeeder.run(em);
        const ajusteSeeder = new AjusteSeeder();
        await ajusteSeeder.run(em);
        const productoSeeder = new ProductoSeeder();
        await productoSeeder.run(em);
        const costoFijoSeeder = new CostoFijoSeeder();
        await costoFijoSeeder.run(em);
        const ventaSeeder = new VentaSeeder();
        await ventaSeeder.run(em);
        const detalleSeeder = new DetalleSeeder();
        await detalleSeeder.run(em);
        const pagoSeeder = new PagoSeeder();
        await pagoSeeder.run(em);
    }
}
  