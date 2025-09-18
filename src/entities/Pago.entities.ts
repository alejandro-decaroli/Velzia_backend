import { Entity, Property, ManyToOne } from "@mikro-orm/core";
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

    nombreCaja(): string {
        return this.caja?.nombre || '';
    }

    nombreCliente(): string {
        return this.venta?.cliente?.nombre || '';
    }

    monedaVenta(): string {
        return this.venta?.moneda?.nombre || '';
    }

    monedaCostoFijo(): string {
        return this.costo_fijo?.moneda?.nombre || '';
    }

    monedaCostoVariable(): string {
        return this.costo_variable?.moneda?.nombre || '';
    }
}