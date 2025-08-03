import { Entity, Property, ManyToOne, Cascade, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Pago } from "./Pago.entities.js";
import { CostoVariable } from "./Costovariable.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Venta extends BaseEntity {

    @ManyToOne('Moneda', {nullable: false})
    moneda!: Moneda;

    @OneToMany('Pago', 'venta', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);

    @OneToMany('CostoVariable', 'venta', {cascade: [Cascade.ALL], nullable: true})
    costos_variables = new Collection<CostoVariable>(this);

    @Property({ type: 'numeric', nullable: false })
    monto!: number;

    @ManyToOne('Cliente', {nullable: false})
    cliente!: Cliente;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @Property({ default: 'activa', nullable: true })
    estado?: 'activa' | 'finalizada'; // activa, finalizada
}   