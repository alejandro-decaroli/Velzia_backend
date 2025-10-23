import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Ajuste } from "./Ajuste.entities.js";
import { Pago } from "./Pago.entities.js";
import { Aporte } from "./Aporte.entities.js";
import { Transferencia } from "./Transferencia.entities.js";
import { Dividendo } from "./Dividendo.entities.js";
import { Usuario } from "./Usuario.entities.js";

@Entity()
export class Caja extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda!: Moneda;
    
    @OneToMany('Ajuste', 'caja', {cascade: [Cascade.ALL], nullable: true})
    ajustes = new Collection<Ajuste>(this);
    
    @OneToMany('Pago', 'caja', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);
    
    @OneToMany('Aporte', 'caja', {cascade: [Cascade.ALL], nullable: true})
    aportes = new Collection<Aporte>(this);
    
    @OneToMany('Dividendo', 'caja', {cascade: [Cascade.ALL], nullable: true})
    dividendos = new Collection<Dividendo>(this);
    
    @OneToMany('Transferencia', 'caja_origen', {cascade: [Cascade.ALL], nullable: true})
    transferencias_origen = new Collection<Transferencia>(this);
    
    @OneToMany('Transferencia', 'caja_destino', {cascade: [Cascade.ALL], nullable: true})
    transferencias_destino = new Collection<Transferencia>(this);
    
    @Property({ type: 'varchar', length: 20, nullable: false, unique: true })
    nombre!: string;
    
    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    monto!: number;

    @Property({ type: 'varchar', length: 20, nullable: false })
    tipo_moneda!: string;

    @ManyToOne('Usuario', {onDelete: 'cascade', cascade: [Cascade.ALL], nullable: false} as any)
    usuario!: Usuario;

    constructor() {
        super();
        this.tipo_moneda = this.moneda?.codigo_iso || '';
    }
}