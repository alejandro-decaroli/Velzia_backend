import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Venta } from "./Venta.entities.js";

@Entity()
export class Pago extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @ManyToOne('Venta', { nullable: false })
    venta!: Venta;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;
}