import { Entity, OneToMany, Cascade, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Venta } from "./Venta.entities.js";
import { Costo } from "./Costo.entities.js";

@Entity()
export class Usuario extends BaseEntity {

  @Property({ length: 20, nullable: false, default: 'user'  })
  rol!: 'admin' | 'user';

  @Property({ length: 100, nullable: false })
  nombre!: string;

  @Property({ length: 100, nullable: false })
  apellido!: string;

  @Property({ length: 100, nullable: false })
  contrasenia!: string;

  @Property({ length: 100, nullable: false })
  email!: string;

  @OneToMany('Cliente', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  clientes = new Collection<Cliente>(this);

  @OneToMany('Venta', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  venta = new Collection<Venta>(this);

  @OneToMany('Costo', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  costo = new Collection<Costo>(this);

  toJSON() {
    const { contrasenia, ...rest } = this;
    return rest;
  }
}