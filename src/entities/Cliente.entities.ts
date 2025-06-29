// src/entities/Cliente.entities.ts
import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.entities.js";
import { Venta } from "./Venta.entities.js";

@Entity()
export class Cliente extends BaseEntity {
  @Property({ length: 100, nullable: false, unique: true })
  nombre!: string;

  @Property({ length: 3, nullable: false, unique: true })
  siglas!: string;

  @OneToMany('Venta', 'cliente', {cascade: [Cascade.ALL], nullable: true})
  ventas = new Collection<Venta>(this);

  @Property({ persist: false })
  get estado(): 'activo' | 'terminado' {
    if (!this.ventas.isInitialized()) {
        // Si las ventas no se han cargado, no podemos determinar el estado.
        // Considera cargarlas antes de acceder a esta propiedad.
        return 'terminado'; 
    }

    const tieneVentaActiva = this.ventas.getItems().some(venta => venta.estado === true);
    return tieneVentaActiva ? 'activo' : 'terminado';
  }

  /**
   * Verifica si el cliente ya tiene una venta activa, excluyendo la venta que se está editando.
   * @param ventaActualId - El ID de la venta que se está creando o editando (opcional).
   * @returns `true` si ya existe una venta activa, de lo contrario `false`.
   */
  hasActiveSale(ventaActualId?: number): boolean {
    if (!this.ventas.isInitialized()) {
        return false;
    }
    return this.ventas.getItems().some(v => v.estado === true && v.id !== ventaActualId);
  }
}