import { Migration } from '@mikro-orm/migrations';

export class Migration20251026012957 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "usuario" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "producto" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "moneda" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "tasa" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "costo_variable" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "costo_fijo" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "cliente" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "caja" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "transferencia" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "dividendo" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "aporte" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "ajuste" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "venta" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "pago" add column "codigo" varchar(255) null;`);

    this.addSql(`alter table "detalle" add column "codigo" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "usuario" drop column "codigo";`);

    this.addSql(`alter table "producto" drop column "codigo";`);

    this.addSql(`alter table "moneda" drop column "codigo";`);

    this.addSql(`alter table "tasa" drop column "codigo";`);

    this.addSql(`alter table "costo_variable" drop column "codigo";`);

    this.addSql(`alter table "costo_fijo" drop column "codigo";`);

    this.addSql(`alter table "cliente" drop column "codigo";`);

    this.addSql(`alter table "caja" drop column "codigo";`);

    this.addSql(`alter table "transferencia" drop column "codigo";`);

    this.addSql(`alter table "dividendo" drop column "codigo";`);

    this.addSql(`alter table "aporte" drop column "codigo";`);

    this.addSql(`alter table "ajuste" drop column "codigo";`);

    this.addSql(`alter table "venta" drop column "codigo";`);

    this.addSql(`alter table "pago" drop column "codigo";`);

    this.addSql(`alter table "detalle" drop column "codigo";`);
  }

}
