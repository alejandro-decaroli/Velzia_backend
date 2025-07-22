// src/entities/Cliente.entities.ts
import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Venta } from "./Venta.entities.js";

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

  @Property({ length: 3, nullable: false, unique: true })
  siglas!: string;

  @Property({ length: 100, nullable: true })
  direccion?: string;

  @OneToMany('Venta', 'cliente', {cascade: [Cascade.ALL], nullable: true})
  ventas = new Collection<Venta>(this);

  @Property({default: 'terminado', nullable: true})
  estado:'terminado' | 'activo' = 'terminado'

  /*getEstado() {
    if (this.ventas.length === 0) {
      return 'terminado';
    }
    for (const venta of this.ventas) {
      if (venta.estado === true) {
        return 'activo';
      }
    }
    return 'terminado';
  }*/
}