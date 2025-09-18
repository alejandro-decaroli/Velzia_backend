import { Entity, Property, OneToMany, Collection, Cascade, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Venta } from "./Venta.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Cliente extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombre!: string;

  @Property({ length: 100, nullable: false })
  apellido!: string;

  @Property({ length: 100, nullable: false })
  telefono!: string;

  @Property({ length: 100, nullable: true })
  email?: string;

  @Property({ length: 100, nullable: true })
  direccion?: string;

  @OneToMany('Venta', 'cliente', {cascade: [Cascade.ALL], nullable: true})
  ventas = new Collection<Venta>(this);

  @ManyToOne('Usuario', 'clientes')
  usuario!: Usuario;
  
}