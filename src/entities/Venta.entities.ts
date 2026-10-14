import { Entity, Property, ManyToOne, Cascade, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Pago } from "./Pago.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Detalle } from "./Detalle.entities.js";

@Entity()
export class Venta extends BaseEntity {

    @ManyToOne('Cliente', {nullable: false, eager: true})
    cliente!: Cliente;

    @Property({ default: 'Pendiente', nullable: false })
    estado!: 'Paga' | 'Pendiente' | 'Cancelada';

    @OneToOne('Pago', 'venta', { nullable: true, eager: true })
    pago?: Pago;

    get pagos() {
        return this.pago ? [this.pago] : [];
    }

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @OneToMany('Detalle', 'venta', {cascade: [Cascade.ALL], nullable: true, eager: true})
    detalles = new Collection<Detalle>(this);

    @Property({ type: 'numeric', nullable: false, default: 0 })
    total!: number;

    @Property({ type: 'numeric', nullable: false, default: 0 })
    total_pagado!: number;
    
}   