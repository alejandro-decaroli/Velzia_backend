import { Entity, Property, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Transferencia extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja_origen!: Caja;

    @ManyToOne('Caja', { nullable: false })
    caja_destino!: Caja;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @Property({ type: 'varchar', length: 100, nullable: true })
    motivo?: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_caja_origen!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_caja_destino!: string;

    constructor() {
        super();
        this.nombre_caja_origen = this.caja_origen?.nombre || '';
        this.nombre_caja_destino = this.caja_destino?.nombre || '';
    }

}