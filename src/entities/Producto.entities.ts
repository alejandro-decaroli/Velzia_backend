import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { Detalle } from "./Detalle.entities.js";

@Entity()
export class Producto extends BaseEntity {
    
    @Property({ type: 'varchar', length: 20, nullable: false, unique: true })
    nombre!: string;

    @Property({ type: 'varchar', length: 100, nullable: true })
    descripcion!: string;

    @Property({ type: 'numeric', nullable: false })
    stock!: number;

    @ManyToOne('Usuario', {onDelete: 'cascade', cascade: [Cascade.ALL], nullable: false} as any)
    usuario!: Usuario;

    @OneToMany('Detalle', 'producto', {cascade: [Cascade.ALL], nullable: true})
    detalles = new Collection<Detalle>(this);
}