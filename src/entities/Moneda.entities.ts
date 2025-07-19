import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Venta } from "./Venta.entities.js";
import { CostoFijo } from "./Costofijo.entities.js";
import { CostoVariable } from "./Costovariable.entities.js";
import { Aporte } from "./Aporte.entities.js";
import { Dividendo } from "./Dividendo.entities.js";
import { Transferencia } from "./Transferencia.entities.js";
import { Tasa } from "./Tasa.entities.js";

@Entity()
export class Moneda extends BaseEntity {

    @Property({ type: 'varchar', length: 50, nullable: false })
    nombre!: string;

    @Property({ type: 'varchar', length: 3, nullable: false })
    codigo_iso!: string;

    @OneToMany('Venta', 'moneda', { nullable: true })
    ventas = new Collection<Venta>(this);

    @OneToMany('Caja', 'moneda', { nullable: true })
    cajas = new Collection<Caja>(this);

    @OneToMany('CostoFijo', 'moneda', { nullable: true })
    costos_fijos = new Collection<CostoFijo>(this);

    @OneToMany('CostoVariable', 'moneda', { nullable: true })
    costos_variables = new Collection<CostoVariable>(this);

    @OneToMany('Aporte', 'moneda', { nullable: true })
    aportes = new Collection<Aporte>(this);

    @OneToMany('Dividendo', 'moneda', { nullable: true })
    dividendos = new Collection<Dividendo>(this);

    @OneToMany('Tasa', 'moneda_origen', { nullable: true })
    tasas_origen = new Collection<Tasa>(this);

    @OneToMany('Tasa', 'moneda_destino', { nullable: true })
    tasas_destino = new Collection<Tasa>(this);
}