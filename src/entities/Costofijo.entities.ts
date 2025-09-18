import { Entity, Property, ManyToOne, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Pago } from "./Pago.entities.js";
import { Collection } from "@mikro-orm/core";

@Entity()
export class CostoFijo extends BaseEntity {

    @ManyToOne('Moneda', { nullable: false, eager: true})
    moneda!: Moneda;

    @OneToMany('Pago', 'costo_fijo', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);

    @Property({ type: 'varchar', length: 20, nullable: false })
    adjudicacion!: string;

    @Property({ type: 'varchar', length: 100, nullable: true })
    descripcion?: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @Property({ type: 'varchar', length: 20, nullable: false, default: 'Pendiente' })
    estado!: 'Pendiente' | 'Pagada';

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

    nombreMoneda(): string {
        return this.moneda?.codigo_iso || '';
    }

}