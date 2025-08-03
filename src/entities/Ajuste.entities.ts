import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Ajuste extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @Property({ type: 'varchar', length: 20, nullable: false })
    movimiento!: 'ingreso' | 'egreso';

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;
}