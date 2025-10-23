import { Entity, Property, ManyToOne, Cascade, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Unique({ properties: ['moneda_origen', 'moneda_destino'] })
@Entity()
export class Tasa extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda_origen!: Moneda;

    @ManyToOne('Moneda', { nullable: false })
    moneda_destino!: Moneda;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    tasa!: number;

    @ManyToOne('Usuario', {onDelete: 'cascade', cascade: [Cascade.ALL], nullable: false} as any)
    usuario!: Usuario;  

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_moneda_origen!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_moneda_destino!: string;

    constructor() {
        super();
        this.nombre_moneda_origen = this.moneda_origen?.nombre || '';
        this.nombre_moneda_destino = this.moneda_destino?.nombre || '';
    }
 
}