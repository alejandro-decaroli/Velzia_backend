import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Pago } from "./Pago.entities.js";

@Entity()
export class CostoVariable extends BaseEntity {

    @ManyToOne('Moneda', { nullable: false, eager: true })
    moneda!: Moneda;

    @Property({ type: 'varchar', length: 20, nullable: false })
    adjudicacion!: string;

    @Property({ type: 'varchar', length: 100, nullable: true })
    descripcion?: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    monto!: number;

    @Property({ type: 'varchar', length: 20, nullable: false, default: 'Pendiente' })
    estado!: 'Pendiente' | 'Pagada';

    @OneToMany('Pago', 'costo_variable', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    nombreMoneda(): string {
        return this.moneda?.codigo_iso || '';
    }
}