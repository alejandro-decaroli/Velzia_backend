import { Entity, Property, ManyToOne, OneToOne, Cascade, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Usuario } from "./Usuario.entities.js";
import type { MovF } from "./MovF.entities.js";

@Entity()
export class Costo extends BaseEntity {

    @Property({ type: 'varchar', length: 50, nullable: false})
    categoria!: string;

    @Property({ type: 'varchar', length: 150, nullable: false })
    descripcion!: string;

    @Property({ type: 'numeric', precision: 14, scale: 4, nullable: false })
    monto!: number;

    @Property({ type: 'varchar', length: 50, nullable: false, default: 'Pendiente' })
    estado: string = 'Pendiente';

    @OneToOne('MovF', 'costo', { nullable: true })
    mov_f?: Rel<MovF>;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;

}