import { Entity, Property, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Caja } from "./Caja.entities.js";
import { Venta } from "./Venta.entities.js";
import { Usuario } from "./Usuario.entities.js";
import { CostoFijo } from "./Costofijo.entities.js";
import { CostoVariable } from "./Costovariable.entities.js";

@Entity()
export class Pago extends BaseEntity {

    @ManyToOne('Caja', { nullable: false })
    caja!: Caja;

    @ManyToOne('Venta', { nullable: true, eager: true })
    venta?: Venta;

    @Property({ type: 'numeric', precision: 10, scale: 4, nullable: false })
    monto!: number;

    @ManyToOne('Usuario', {nullable: false})
    usuario!: Usuario;    

    @ManyToOne('CostoFijo', {nullable: true, eager: true})
    costo_fijo?: CostoFijo;

    @ManyToOne('CostoVariable', {nullable: true, eager: true})
    costo_variable?: CostoVariable;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_caja!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_cliente!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    nombre_moneda!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    id_costo_fijo!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    id_costo_variable!: string;

    @Property({ type: 'varchar', length: 50, nullable: false})
    id_venta!: string;

    constructor() {
        super();
        this.nombre_caja = this.caja?.nombre || 'No asociado';
        this.nombre_cliente = this.venta?.cliente?.nombre || 'No asociado';
        this.nombre_moneda = this.venta?.moneda?.nombre || 'No asociado';
        this.id_costo_variable = this.costo_variable?.id?.toString() || 'No asociado';
        this.id_costo_fijo = this.costo_fijo?.id?.toString() || 'No asociado';
        this.id_venta = this.venta?.id?.toString() || 'No asociado';
    }
}