import { Entity, OneToMany, Cascade, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";

@Entity()
export class Usuario extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombre!: string;

  @Property({ length: 100, nullable: false })
  apellido!: string;

  @Property({ length: 100, nullable: false })
  contrasenia!: string;

  @Property({ length: 100, nullable: true })
  email?: string;

  @OneToMany('Cliente', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  clientes = new Collection<Cliente>(this);

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasenia, ...rest } = this;
    return rest;
  }
}