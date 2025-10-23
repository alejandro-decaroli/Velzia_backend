import { Entity, Property, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Aporte extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @ManyToOne('Usuario', {onDelete: 'cascade', cascade: [Cascade.ALL], nullable: false} as any)
    usuario!: Usuario;

    @Property({ type: 'string', nullable: false })
    nombre_caja!: string;

    constructor() {
        super();
        this.nombre_caja = this.caja?.nombre || '';
    }
}