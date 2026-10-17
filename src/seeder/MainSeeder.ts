import { Seeder } from "@mikro-orm/seeder";
import { UserSeeder } from "./UserSeeder.js";
import { EntityManager } from "@mikro-orm/core";
import { ClienteSeeder } from "./ClienteSeeder.js";
import { CajaSeeder } from "./CajaSeeder.js";
import { ProductoSeeder } from "./ProductoSeeder.js";
import { VentaSeeder } from "./VentasSeeder.js";
import { DetalleSeeder } from "./DetallesSeeder.js";
import { CostoSeeder } from "./CostoSeeder.js";
import { ProveedorSeeder } from "./ProveedorSeeder.js";
import { PedidoSeeder } from "./PedidoSeeder.js";
import { LineaPedidoSeeder } from "./LineaPedidoSeeder.js";

export class MainSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const userSeeder = new UserSeeder();
        await userSeeder.run(em);
        const clienteSeeder = new ClienteSeeder();
        await clienteSeeder.run(em);
        const cajaSeeder = new CajaSeeder();
        await cajaSeeder.run(em);
        const productoSeeder = new ProductoSeeder();
        await productoSeeder.run(em);
        const costoSeeder = new CostoSeeder();
        await costoSeeder.run(em);
        const proveedorSeeder = new ProveedorSeeder();
        await proveedorSeeder.run(em);
        const pedidoSeeder = new PedidoSeeder();
        await pedidoSeeder.run(em);
        const lineaPedidoSeeder = new LineaPedidoSeeder();
        await lineaPedidoSeeder.run(em);
        const ventaSeeder = new VentaSeeder();
        await ventaSeeder.run(em);
        const detalleSeeder = new DetalleSeeder();
        await detalleSeeder.run(em);
    }
}

  