import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Usuario } from "./Usuario.entities.js";
import type { MovF } from "./MovF.entities.js";

@Entity()
export class Caja extends BaseEntity {
    
    @Property({ type: 'varchar', length: 20, nullable: false, unique: true })
    nombre!: string;
    
    @Property({ type: 'numeric', precision: 14, scale: 4, nullable: false, default: 0 })
    monto!: number;

    @OneToMany('MovF', 'caja', {cascade: [Cascade.ALL], nullable: true})
    movs_f = new Collection<MovF>(this);

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;
}