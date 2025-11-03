import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Producto } from "./Producto.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Venta } from "./Venta.entities.js";

@Entity()
export class Detalle extends BaseEntity {
    
    @ManyToOne('Venta', {nullable: false, eager: true})
    venta!: Venta;

    @ManyToOne('Producto', {nullable: false, eager: true})
    producto!: Producto;
    
    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    precio_unitario!: number;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    cantidad!: number;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    descuento!: number;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    subtotal!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    constructor() {
        super();
        this.subtotal = (this.cantidad * this.precio_unitario) * (1 - (this.descuento / 100));
    }
    
}