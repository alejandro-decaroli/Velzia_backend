import { Entity, Property, OneToMany, Collection, Cascade, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Pedido } from "./Pedido.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Proveedor extends BaseEntity {

  @Property({ type: 'varchar', length: 150, nullable: false })
  razon_social!: string;

  @Property({ type: 'varchar', length: 20, nullable: false })
  cuit!: string;

  @Property({ type: 'varchar', length: 100, nullable: false })
  telefono!: string;

  @Property({ type: 'varchar', length: 100, nullable: false })
  email!: string;

  @Property({ type: 'varchar', length: 150, nullable: false })
  direccion!: string;

  @OneToMany('Pedido', 'proveedor', { cascade: [Cascade.ALL], nullable: true })
  pedidos = new Collection<Pedido>(this);

  @ManyToOne('Usuario', { nullable: false })
  usuario!: Usuario;

}
