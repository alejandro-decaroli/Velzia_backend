import { PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'string', nullable: true })
  cod?: string;

  @Property({ type: 'date', defaultRaw: 'CURRENT_TIMESTAMP' })
  creadoEn = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  actualizadoEn = new Date();

  @Property({ type: 'date', nullable: true })
  eliminadoEn?: Date;

  get createdAt(): Date | undefined {
    return this.creadoEn;
  }
  set createdAt(val: Date | undefined) {
    if (val) this.creadoEn = val;
  }

  get updatedAt(): Date | undefined {
    return this.actualizadoEn;
  }
  set updatedAt(val: Date | undefined) {
    if (val) this.actualizadoEn = val;
  }

  get deletedAt(): Date | undefined {
    return this.eliminadoEn;
  }
  set deletedAt(val: Date | undefined) {
    this.eliminadoEn = val;
  }
}