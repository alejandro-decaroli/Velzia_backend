import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Caja } from "./Caja.entities.js";

@Entity()
export class CostoFijo extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda!: Moneda;

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @Property({ type: 'varchar', length: 20, nullable: false })
    adjudicacion!: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;
}