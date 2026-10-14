import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Pedido } from "./Pedido.entities.js";
import { Producto } from "./Producto.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class LineaPedido extends BaseEntity {

  @ManyToOne('Pedido', { nullable: false, eager: true })
  pedido!: Pedido;

  @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
  cantidad!: number;

  @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
  precio!: number;

  @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
  subtotal!: number;

  @ManyToOne('Producto', { nullable: true, eager: true })
  producto?: Producto;

  @ManyToOne('Usuario', { nullable: true })
  usuario?: Usuario;

  constructor() {
    super();
    if (this.cantidad && this.precio && !this.subtotal) {
      this.subtotal = this.cantidad * this.precio;
    }
  }

}

export { LineaPedido as LineasPedido, LineaPedido as LineaDePedido };
