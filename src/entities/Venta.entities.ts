import { Entity, Property, ManyToOne, Cascade, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Pago } from "./Pago.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Detalle } from "./Detalle.entities.js";

@Entity()
export class Venta extends BaseEntity {

    @ManyToOne('Cliente', {nullable: false, eager: true})
    cliente!: Cliente;

    @Property({ default: 'Pendiente', nullable: false })
    estado!: 'Paga' | 'Pendiente' | 'Cancelada';

    @ManyToOne('Moneda', {nullable: false, eager: true})
    moneda!: Moneda;

    @OneToMany('Pago', 'venta', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @OneToMany('Detalle', 'venta', {cascade: [Cascade.ALL], nullable: true, eager: true})
    detalles = new Collection<Detalle>(this);

    @Property({ type: 'numeric', nullable: false, default: 0 })
    total!: number;
    
    moneda_asociada(): string {
        return this.moneda?.codigo_iso || '';
    }

    nombreCliente(): string {
        return this.cliente?.nombre || '';
    }
}   