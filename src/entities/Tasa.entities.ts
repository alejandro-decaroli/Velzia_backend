import { Entity, Property, ManyToOne, Cascade, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Unique({ properties: ['moneda_origen', 'moneda_destino'] })
@Entity()
export class Tasa extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false, eager: true})
    moneda_origen!: Moneda;

    @ManyToOne('Moneda', { nullable: false, eager: true})
    moneda_destino!: Moneda;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    tasa!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;  
 
}