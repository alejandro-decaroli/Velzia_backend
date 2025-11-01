import { Entity, Property, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Transferencia extends BaseEntity {

    @ManyToOne('Caja', { nullable: false, eager: true})
    caja_origen!: Caja;

    @ManyToOne('Caja', { nullable: false, eager: true})
    caja_destino!: Caja;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    @Property({ type: 'varchar', length: 100, nullable: true })
    motivo?: string;

}