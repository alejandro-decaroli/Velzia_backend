import { Entity, Property, ManyToOne, Cascade, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { LineaVenta } from "./LineaVenta.entities.js";

@Entity()
export class Venta extends BaseEntity {

    @ManyToOne('Cliente', {nullable: false, eager: true})
    cliente!: Cliente;

    @Property({ default: 'Pendiente', nullable: false })
    estado!: 'Paga' | 'Pendiente' | 'Cancelada';

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @OneToMany('LineaVenta', 'venta', {cascade: [Cascade.ALL], nullable: true, eager: true})
    linea_venta = new Collection<LineaVenta>(this);

    @Property({ type: 'numeric', nullable: false, default: 0 })
    total!: number;
    
}   