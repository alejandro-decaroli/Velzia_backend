import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Moneda } from "./Moneda.entities.js";
import { Ajuste } from "./Ajuste.entities.js";
import { Pago } from "./Pago.entities.js";
import { CostoFijo } from "./Costofijo.entities.js";
import { CostoVariable } from "./Costovariable.entities.js";
import { Aporte } from "./Aporte.entities.js";
import { Transferencia } from "./Transferencia.entities.js";
import { Dividendo } from "./Dividendo.entities.js";

@Entity()
export class Caja extends BaseEntity {
    @ManyToOne('Moneda', { nullable: false })
    moneda!: Moneda;

    @OneToMany('Ajuste', 'caja', {cascade: [Cascade.ALL], nullable: true})
    ajustes = new Collection<Ajuste>(this);

    @OneToMany('Pago', 'caja', {cascade: [Cascade.ALL], nullable: true})
    pagos = new Collection<Pago>(this);

    @OneToMany('CostoFijo', 'caja', {cascade: [Cascade.ALL], nullable: true})
    costos_fijos = new Collection<CostoFijo>(this);

    @OneToMany('CostoVariable', 'caja', {cascade: [Cascade.ALL], nullable: true})
    costos_variables = new Collection<CostoVariable>(this);

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

    @Property({ type: 'varchar', length: 3, nullable: false, unique: true })
    siglas!: string;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false, default: 0 })
    monto!: number;
}