// src/entities/BaseEntity.entities.ts
import { PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ default: true, nullable: false })
  visible!: boolean;

  @Property({ type: 'date', defaultRaw: 'CURRENT_TIMESTAMP' })
  creadoEn = new Date();

  @Property({ onUpdate: () => new Date() })
  actualizadoEn = new Date();

  @Property({ nullable: true })
  eliminadoEn?: Date;
}