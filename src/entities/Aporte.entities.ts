import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Caja } from "./Caja.entities.js";

@Entity()
export class Aporte extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda!: Moneda;

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @Property({ type: 'varchar', length: 20, nullable: false })
    aporte!: string;

    @Property({ type: 'date', nullable: false })
    fecha!: Date;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;
}