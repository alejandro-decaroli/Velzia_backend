import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Producto } from "./Producto.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Venta } from "./Venta.entities.js";

@Entity()
export class LineaVenta extends BaseEntity {
    
    @ManyToOne('Venta', {nullable: false, eager: true})
    venta!: Venta;

    @ManyToOne('Producto', {nullable: false, eager: true})
    producto!: Producto;
    
    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    precio!: number;

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
        if (this.producto?.precio_venta && !this.precio) {
            this.precio = Number(this.producto.precio_venta);
        }
        if (this.cantidad && this.precio) {
            this.subtotal = (this.cantidad * this.precio) * (1 - ((this.descuento || 0) / 100));
        }
    }
    
}
