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

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;  

    get nombreMonedaOrigen(): string {
        return this.moneda_origen?.nombre || '';
    }

    get nombreMonedaDestino(): string {
        return this.moneda_destino?.nombre || '';
    }  
}