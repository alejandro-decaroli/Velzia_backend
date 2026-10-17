import { Entity, Property, ManyToOne, OneToMany, OneToOne, Collection, Cascade, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Proveedor } from "./Proveedor.entities.js";
import { LineaPedido } from "./LineaPedido.entities.js";
import { Usuario } from "./Usuario.entities.js";
import type { MovF } from "./MovF.entities.js";

@Entity()
export class Pedido extends BaseEntity {

  @Property({ type: 'date', nullable: false, defaultRaw: 'CURRENT_TIMESTAMP' })
  fecha_emision: Date = new Date();

  @Property({ type: 'date', nullable: true })
  fecha_recepcion?: Date;

  @Property({ type: 'numeric', precision: 10, scale: 2, nullable: false, default: 0 })
  total: number = 0;

  @Property({ type: 'varchar', length: 50, nullable: false, default: 'Pendiente' })
  estado: string = 'Pendiente';

  @ManyToOne('Proveedor', { nullable: false, eager: true })
  proveedor!: Proveedor;

  @OneToOne('MovF', 'pedido', { nullable: true })
  mov_f?: Rel<MovF>;

  @OneToMany('LineaPedido', 'pedido', { cascade: [Cascade.ALL], nullable: true, eager: true })
  lineas = new Collection<LineaPedido>(this);

  @ManyToOne('Usuario', { nullable: false })
  usuario!: Usuario;


  get lineas_pedido() {
    return this.lineas;
  }

}
