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

    @Property({ type: 'varchar', length: 150, nullable: false})
    nombre_cliente!: string;

    @Property({ type: 'varchar', length: 150, nullable: false})
    apellido_cliente!: string;

    @OneToMany('Detalle', 'venta', {cascade: [Cascade.ALL], nullable: true, eager: true})
    detalles = new Collection<Detalle>(this);

    @Property({ type: 'numeric', nullable: false, default: 0 })
    total!: number;
    
    @Property({ type: 'varchar', length: 50, nullable: false})
    moneda_asociada!: string;

    constructor() {
        super();
        this.nombre_cliente = this.cliente?.nombre || '';
        this.apellido_cliente = this.cliente?.apellido || '';
        this.moneda_asociada = this.moneda?.codigo_iso || '';
    }
}   