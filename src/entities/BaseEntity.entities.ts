// src/entities/BaseEntity.entities.ts
import { PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'string', nullable: true })
  codigo?: string;

  @Property({ default: true, nullable: false })
  visible!: boolean;

  @Property({ type: 'date', defaultRaw: 'CURRENT_TIMESTAMP' })
  creadoEn = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  actualizadoEn = new Date();

  @Property({ type: 'date', nullable: true })
  eliminadoEn?: Date;
}