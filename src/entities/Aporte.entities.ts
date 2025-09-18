import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Aporte extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    get nombreCaja(): string {
        return this.caja?.nombre || '';
    }

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;
}