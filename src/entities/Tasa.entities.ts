import { Entity, Property, ManyToOne, Cascade, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";

@Unique({ properties: ['moneda_origen', 'moneda_destino'] })
@Entity()
export class Tasa extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda_origen!: Moneda;

    @ManyToOne('Moneda', { nullable: false })
    moneda_destino!: Moneda;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    tasa!: number;
}