import { Entity, Property, OneToMany, Collection, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Venta } from "./Venta.entities.js";
import { Tasa } from "./Tasa.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Moneda extends BaseEntity {

    @Property({ type: 'varchar', length: 50, nullable: false })
    nombre!: string;

    @Property({ type: 'boolean', default: false, nullable: false })
    principal!: boolean;

    @Property({ type: 'varchar', length: 3, nullable: false })
    codigo_iso!: string;

    @OneToMany('Venta', 'moneda', { nullable: true })
    ventas = new Collection<Venta>(this);

    @OneToMany('Caja', 'moneda', { nullable: true })
    cajas = new Collection<Caja>(this);

    @OneToMany('Tasa', 'moneda_origen', { nullable: true })
    tasas_origen = new Collection<Tasa>(this);

    @OneToMany('Tasa', 'moneda_destino', { nullable: true })
    tasas_destino = new Collection<Tasa>(this);

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;
}