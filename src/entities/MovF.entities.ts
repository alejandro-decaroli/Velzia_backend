import { Entity, Cascade, Property, OneToOne, ManyToOne, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import type { Venta } from "./Venta.entities.js";
import type { Costo } from "./Costo.entities.js";
import type { Caja } from "./Caja.entities.js";
import type { Pedido } from "./Pedido.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class MovF extends BaseEntity {

  @Property({ default: 'Egreso', nullable: false })
  tipo!: 'Ingreso' | 'Egreso';

  @Property({ type: 'varchar', length: 50, nullable: false})
  categoria!: string;

  @Property({ type: 'varchar', length: 150, nullable: false })
  descripcion!: string;

  @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
  monto!: number;

  @OneToOne('Venta', { cascade: [Cascade.ALL], nullable: true })
  venta?: Rel<Venta>;

  @OneToOne('Costo', { cascade: [Cascade.ALL], nullable: true })
  costo?: Rel<Costo>;

  @ManyToOne('Caja', { nullable: false, eager: true })
  caja!: Rel<Caja>;

  @OneToOne('Pedido', { cascade: [Cascade.ALL], nullable: true })
  pedido?: Rel<Pedido>;

  @ManyToOne('Usuario', {nullable: false})
  usuario!: Usuario;

}