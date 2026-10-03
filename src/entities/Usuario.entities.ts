import { Entity, OneToMany, Cascade, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Cliente } from "./Cliente.entities.js";
import { Venta } from "./Venta.entities.js";
import { Transferencia } from "./Transferencia.entities.js";
import { Pago } from "./Pago.entities.js";
import { CostoFijo } from "./Costofijo.entities.js";
import { Ajuste } from "./Ajuste.entities.js";

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

  @OneToMany('Transferencia', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  transferencia = new Collection<Transferencia>(this);

  @OneToMany('Pago', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  pago = new Collection<Pago>(this);

  @OneToMany('CostoFijo', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  costoFijo = new Collection<CostoFijo>(this);

  @OneToMany('Ajuste', 'usuario', { cascade: [Cascade.ALL], nullable: true })
  ajuste = new Collection<Ajuste>(this);

  toJSON() {
    const { contrasenia, ...rest } = this;
    return rest;
  }
}