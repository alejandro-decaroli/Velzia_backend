import { Migration } from '@mikro-orm/migrations';

export class Migration20251101173540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "usuario" drop column "visible";`);

    this.addSql(`alter table "usuario" rename column "codigo" to "cod";`);

    this.addSql(`alter table "producto" drop column "visible";`);

    this.addSql(`alter table "producto" rename column "codigo" to "cod";`);

    this.addSql(`alter table "moneda" drop column "visible";`);

    this.addSql(`alter table "moneda" rename column "codigo" to "cod";`);

    this.addSql(`alter table "tasa" drop column "visible", drop column "nombre_moneda_origen", drop column "nombre_moneda_destino";`);

    this.addSql(`alter table "tasa" rename column "codigo" to "cod";`);

    this.addSql(`alter table "costo_variable" drop column "visible", drop column "nombre_moneda";`);

    this.addSql(`alter table "costo_variable" rename column "codigo" to "cod";`);

    this.addSql(`alter table "costo_fijo" drop column "visible", drop column "nombre_moneda";`);

    this.addSql(`alter table "costo_fijo" rename column "codigo" to "cod";`);

    this.addSql(`alter table "cliente" drop column "visible";`);

    this.addSql(`alter table "cliente" rename column "codigo" to "cod";`);

    this.addSql(`alter table "caja" drop column "visible", drop column "tipo_moneda";`);

    this.addSql(`alter table "caja" rename column "codigo" to "cod";`);

    this.addSql(`alter table "transferencia" drop column "visible", drop column "nombre_caja_origen", drop column "nombre_caja_destino";`);

    this.addSql(`alter table "transferencia" rename column "codigo" to "cod";`);

    this.addSql(`alter table "dividendo" drop column "visible", drop column "nombre_caja";`);

    this.addSql(`alter table "dividendo" rename column "codigo" to "cod";`);

    this.addSql(`alter table "aporte" drop column "visible";`);

    this.addSql(`alter table "aporte" rename column "codigo" to "cod";`);

    this.addSql(`alter table "ajuste" drop column "visible", drop column "nombre_caja";`);

    this.addSql(`alter table "ajuste" rename column "codigo" to "cod";`);

    this.addSql(`alter table "venta" drop column "visible", drop column "nombre_cliente", drop column "apellido_cliente", drop column "moneda_asociada";`);

    this.addSql(`alter table "venta" rename column "codigo" to "cod";`);

    this.addSql(`alter table "pago" drop column "visible", drop column "nombre_caja", drop column "nombre_cliente", drop column "nombre_moneda", drop column "id_costo_fijo", drop column "id_costo_variable", drop column "id_venta";`);

    this.addSql(`alter table "pago" rename column "codigo" to "cod";`);

    this.addSql(`alter table "detalle" drop column "visible";`);

    this.addSql(`alter table "detalle" rename column "codigo" to "cod";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "usuario" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "usuario" rename column "cod" to "codigo";`);

    this.addSql(`alter table "producto" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "producto" rename column "cod" to "codigo";`);

    this.addSql(`alter table "moneda" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "moneda" rename column "cod" to "codigo";`);

    this.addSql(`alter table "tasa" add column "visible" boolean not null default true, add column "nombre_moneda_origen" varchar(50) not null default '', add column "nombre_moneda_destino" varchar(50) not null default '';`);
    this.addSql(`alter table "tasa" rename column "cod" to "codigo";`);

    this.addSql(`alter table "costo_variable" add column "visible" boolean not null default true, add column "nombre_moneda" varchar(50) not null default '';`);
    this.addSql(`alter table "costo_variable" rename column "cod" to "codigo";`);

    this.addSql(`alter table "costo_fijo" add column "visible" boolean not null default true, add column "nombre_moneda" varchar(50) not null default '';`);
    this.addSql(`alter table "costo_fijo" rename column "cod" to "codigo";`);

    this.addSql(`alter table "cliente" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "cliente" rename column "cod" to "codigo";`);

    this.addSql(`alter table "caja" add column "visible" boolean not null default true, add column "tipo_moneda" varchar(20) not null default '';`);
    this.addSql(`alter table "caja" rename column "cod" to "codigo";`);

    this.addSql(`alter table "transferencia" add column "visible" boolean not null default true, add column "nombre_caja_origen" varchar(50) not null default '', add column "nombre_caja_destino" varchar(50) not null default '';`);
    this.addSql(`alter table "transferencia" rename column "cod" to "codigo";`);

    this.addSql(`alter table "dividendo" add column "visible" boolean not null default true, add column "nombre_caja" varchar(50) not null default '';`);
    this.addSql(`alter table "dividendo" rename column "cod" to "codigo";`);

    this.addSql(`alter table "aporte" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "aporte" rename column "cod" to "codigo";`);

    this.addSql(`alter table "ajuste" add column "visible" boolean not null default true, add column "nombre_caja" varchar(50) not null default '';`);
    this.addSql(`alter table "ajuste" rename column "cod" to "codigo";`);

    this.addSql(`alter table "venta" add column "visible" boolean not null default true, add column "nombre_cliente" varchar(150) not null default '', add column "apellido_cliente" varchar(150) not null default '', add column "moneda_asociada" varchar(50) not null default '';`);
    this.addSql(`alter table "venta" rename column "cod" to "codigo";`);

    this.addSql(`alter table "pago" add column "visible" boolean not null default true, add column "nombre_caja" varchar(50) not null default 'No asociado', add column "nombre_cliente" varchar(50) not null default 'No asociado', add column "nombre_moneda" varchar(50) not null default 'No asociado', add column "id_costo_fijo" varchar(50) not null default 'No asociado', add column "id_costo_variable" varchar(50) not null default 'No asociado', add column "id_venta" varchar(50) not null default 'No asociado';`);
    this.addSql(`alter table "pago" rename column "cod" to "codigo";`);

    this.addSql(`alter table "detalle" add column "visible" boolean not null default true;`);
    this.addSql(`alter table "detalle" rename column "cod" to "codigo";`);
  }

}
