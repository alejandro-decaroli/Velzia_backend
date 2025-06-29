import { Entity, Property, ManyToOne, Cascade, Unique, Index } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";

@Unique({ properties: ['moneda_origen', 'moneda_destino', 'fecha_vigencia'] })
@Entity()
export class Tasa extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda_origen!: Moneda;

    @ManyToOne('Moneda', { nullable: false })
    moneda_destino!: Moneda;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    tasa!: number;

    @Index()
    @Property({ type: 'date', nullable: false })
    fecha_vigencia!: Date;

    @Property({ type: 'boolean', default: true })
    activa: boolean = true;

    constructor(moneda_origen: Moneda, moneda_destino: Moneda, tasa: number, fecha_vigencia: Date) {
        super();
        if (moneda_origen.id === moneda_destino.id) {
            throw new Error('La moneda de origen no puede ser igual a la moneda de destino');
        }
        this.moneda_origen = moneda_origen;
        this.moneda_destino = moneda_destino;
        this.tasa = tasa;
        this.fecha_vigencia = fecha_vigencia;
    }
}