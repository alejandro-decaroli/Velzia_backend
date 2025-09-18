import { Entity, Property, ManyToOne } from "@mikro-orm/core";
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

    get nombreCajaOrigen(): string {
        return this.caja_origen?.nombre || '';
    }

    get nombreCajaDestino(): string {
        return this.caja_destino?.nombre || '';
    }
}