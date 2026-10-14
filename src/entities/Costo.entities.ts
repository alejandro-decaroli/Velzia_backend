import { Entity, Property, ManyToOne, OneToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Pago } from "./Pago.entities.js";

@Entity()
export class Costo extends BaseEntity {

    @OneToOne('Pago', 'costo', { nullable: true, eager: true })
    pago?: Pago;

    get pagos() {
        return this.pago ? [this.pago] : [];
    }

    @Property({ type: 'varchar', length: 50, nullable: false})
    categoria!: string;

    @Property({ type: 'varchar', length: 150, nullable: false })
    descripcion!: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @Property({ type: 'varchar', length: 20, nullable: false, default: 'Pendiente' })
    estado!: 'Pendiente' | 'Pagada';

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

}