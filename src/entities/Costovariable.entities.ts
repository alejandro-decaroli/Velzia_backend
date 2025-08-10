import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Venta } from "./Venta.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class CostoVariable extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @ManyToOne('Venta', { nullable: false })
    venta!: Venta;

    @Property({ type: 'varchar', length: 20, nullable: false })
    adjudicacion!: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    presupuestado!: number;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    monto_real!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;
}