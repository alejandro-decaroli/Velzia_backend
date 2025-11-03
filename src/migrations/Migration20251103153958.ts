import { Migration } from '@mikro-orm/migrations';

export class Migration20251103153958 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "usuario" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "rol" varchar(20) not null default 'user', "nombre" varchar(100) not null, "apellido" varchar(100) not null, "contrasenia" varchar(100) not null, "email" varchar(100) not null);`);

    this.addSql(`create table "producto" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "nombre" varchar(20) not null, "descripcion" varchar(100) null, "stock" numeric(10,0) not null, "usuario_id" int not null);`);

    this.addSql(`create table "moneda" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "nombre" varchar(50) not null, "principal" boolean not null default false, "codigo_iso" varchar(3) not null, "usuario_id" int not null);`);

    this.addSql(`create table "tasa" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "moneda_origen_id" int not null, "moneda_destino_id" int not null, "tasa" numeric(10,4) not null, "usuario_id" int not null);`);
    this.addSql(`alter table "tasa" add constraint "tasa_moneda_origen_id_moneda_destino_id_unique" unique ("moneda_origen_id", "moneda_destino_id");`);

    this.addSql(`create table "costo_variable" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "moneda_id" int not null, "adjudicacion" varchar(20) not null, "categoria" varchar(20) not null, "unidad" varchar(20) not null, "cantidad" numeric(10,4) not null default 0, "precio_unitario" numeric(10,4) not null default 0, "monto" numeric(10,4) not null default 0, "monto_pagado" numeric(10,4) not null default 0, "estado" varchar(20) not null default 'Pendiente', "usuario_id" int not null);`);

    this.addSql(`create table "costo_fijo" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "moneda_id" int not null, "categoria" varchar(50) not null, "adjudicacion" varchar(20) not null, "monto" numeric(10,4) not null, "monto_pagado" numeric(10,4) not null default 0, "estado" varchar(20) not null default 'Pendiente', "usuario_id" int not null);`);

    this.addSql(`create table "cliente" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "nombre" varchar(100) not null, "apellido" varchar(100) not null, "telefono" varchar(100) not null, "email" varchar(100) null, "direccion" varchar(100) null, "usuario_id" int not null);`);

    this.addSql(`create table "caja" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "moneda_id" int not null, "nombre" varchar(20) not null, "monto" numeric(10,4) not null default 0, "usuario_id" int not null);`);
    this.addSql(`alter table "caja" add constraint "caja_nombre_unique" unique ("nombre");`);

    this.addSql(`create table "transferencia" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "caja_origen_id" int not null, "caja_destino_id" int not null, "monto" numeric(10,4) not null, "usuario_id" int not null, "motivo" varchar(100) null);`);

    this.addSql(`create table "dividendo" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "caja_id" int not null, "monto" numeric(10,4) not null, "usuario_id" int not null);`);

    this.addSql(`create table "aporte" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "caja_id" int not null, "monto" numeric(10,4) not null, "usuario_id" int not null);`);

    this.addSql(`create table "ajuste" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "caja_id" int not null, "monto" numeric(10,4) not null, "movimiento" varchar(20) not null, "usuario_id" int not null);`);

    this.addSql(`create table "venta" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "cliente_id" int not null, "estado" varchar(255) not null default 'Pendiente', "moneda_id" int not null, "usuario_id" int not null, "total" numeric(10,0) not null default 0, "total_pagado" numeric(10,0) not null default 0);`);

    this.addSql(`create table "pago" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "caja_id" int not null, "venta_id" int null, "monto" numeric(10,4) not null, "usuario_id" int not null, "costo_fijo_id" int null, "costo_variable_id" int null);`);

    this.addSql(`create table "detalle" ("id" serial primary key, "cod" varchar(255) null, "creado_en" date not null default CURRENT_TIMESTAMP, "actualizado_en" date not null, "eliminado_en" date null, "venta_id" int not null, "producto_id" int not null, "precio_unitario" numeric(10,4) not null default 0, "cantidad" numeric(10,4) not null default 0, "descuento" numeric(10,4) not null default 0, "subtotal" numeric(10,4) not null default 0, "usuario_id" int not null);`);

    this.addSql(`alter table "producto" add constraint "producto_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "moneda" add constraint "moneda_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "tasa" add constraint "tasa_moneda_origen_id_foreign" foreign key ("moneda_origen_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "tasa" add constraint "tasa_moneda_destino_id_foreign" foreign key ("moneda_destino_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "tasa" add constraint "tasa_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "costo_variable" add constraint "costo_variable_moneda_id_foreign" foreign key ("moneda_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "costo_variable" add constraint "costo_variable_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "costo_fijo" add constraint "costo_fijo_moneda_id_foreign" foreign key ("moneda_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "costo_fijo" add constraint "costo_fijo_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "cliente" add constraint "cliente_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "caja" add constraint "caja_moneda_id_foreign" foreign key ("moneda_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "caja" add constraint "caja_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "transferencia" add constraint "transferencia_caja_origen_id_foreign" foreign key ("caja_origen_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "transferencia" add constraint "transferencia_caja_destino_id_foreign" foreign key ("caja_destino_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "transferencia" add constraint "transferencia_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "dividendo" add constraint "dividendo_caja_id_foreign" foreign key ("caja_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "dividendo" add constraint "dividendo_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "aporte" add constraint "aporte_caja_id_foreign" foreign key ("caja_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "aporte" add constraint "aporte_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "ajuste" add constraint "ajuste_caja_id_foreign" foreign key ("caja_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "ajuste" add constraint "ajuste_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "venta" add constraint "venta_cliente_id_foreign" foreign key ("cliente_id") references "cliente" ("id") on update cascade;`);
    this.addSql(`alter table "venta" add constraint "venta_moneda_id_foreign" foreign key ("moneda_id") references "moneda" ("id") on update cascade;`);
    this.addSql(`alter table "venta" add constraint "venta_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);

    this.addSql(`alter table "pago" add constraint "pago_caja_id_foreign" foreign key ("caja_id") references "caja" ("id") on update cascade;`);
    this.addSql(`alter table "pago" add constraint "pago_venta_id_foreign" foreign key ("venta_id") references "venta" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "pago" add constraint "pago_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);
    this.addSql(`alter table "pago" add constraint "pago_costo_fijo_id_foreign" foreign key ("costo_fijo_id") references "costo_fijo" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "pago" add constraint "pago_costo_variable_id_foreign" foreign key ("costo_variable_id") references "costo_variable" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "detalle" add constraint "detalle_venta_id_foreign" foreign key ("venta_id") references "venta" ("id") on update cascade;`);
    this.addSql(`alter table "detalle" add constraint "detalle_producto_id_foreign" foreign key ("producto_id") references "producto" ("id") on update cascade;`);
    this.addSql(`alter table "detalle" add constraint "detalle_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "producto" drop constraint "producto_usuario_id_foreign";`);

    this.addSql(`alter table "moneda" drop constraint "moneda_usuario_id_foreign";`);

    this.addSql(`alter table "tasa" drop constraint "tasa_usuario_id_foreign";`);

    this.addSql(`alter table "costo_variable" drop constraint "costo_variable_usuario_id_foreign";`);

    this.addSql(`alter table "costo_fijo" drop constraint "costo_fijo_usuario_id_foreign";`);

    this.addSql(`alter table "cliente" drop constraint "cliente_usuario_id_foreign";`);

    this.addSql(`alter table "caja" drop constraint "caja_usuario_id_foreign";`);

    this.addSql(`alter table "transferencia" drop constraint "transferencia_usuario_id_foreign";`);

    this.addSql(`alter table "dividendo" drop constraint "dividendo_usuario_id_foreign";`);

    this.addSql(`alter table "aporte" drop constraint "aporte_usuario_id_foreign";`);

    this.addSql(`alter table "ajuste" drop constraint "ajuste_usuario_id_foreign";`);

    this.addSql(`alter table "venta" drop constraint "venta_usuario_id_foreign";`);

    this.addSql(`alter table "pago" drop constraint "pago_usuario_id_foreign";`);

    this.addSql(`alter table "detalle" drop constraint "detalle_usuario_id_foreign";`);

    this.addSql(`alter table "detalle" drop constraint "detalle_producto_id_foreign";`);

    this.addSql(`alter table "tasa" drop constraint "tasa_moneda_origen_id_foreign";`);

    this.addSql(`alter table "tasa" drop constraint "tasa_moneda_destino_id_foreign";`);

    this.addSql(`alter table "costo_variable" drop constraint "costo_variable_moneda_id_foreign";`);

    this.addSql(`alter table "costo_fijo" drop constraint "costo_fijo_moneda_id_foreign";`);

    this.addSql(`alter table "caja" drop constraint "caja_moneda_id_foreign";`);

    this.addSql(`alter table "venta" drop constraint "venta_moneda_id_foreign";`);

    this.addSql(`alter table "pago" drop constraint "pago_costo_variable_id_foreign";`);

    this.addSql(`alter table "pago" drop constraint "pago_costo_fijo_id_foreign";`);

    this.addSql(`alter table "venta" drop constraint "venta_cliente_id_foreign";`);

    this.addSql(`alter table "transferencia" drop constraint "transferencia_caja_origen_id_foreign";`);

    this.addSql(`alter table "transferencia" drop constraint "transferencia_caja_destino_id_foreign";`);

    this.addSql(`alter table "dividendo" drop constraint "dividendo_caja_id_foreign";`);

    this.addSql(`alter table "aporte" drop constraint "aporte_caja_id_foreign";`);

    this.addSql(`alter table "ajuste" drop constraint "ajuste_caja_id_foreign";`);

    this.addSql(`alter table "pago" drop constraint "pago_caja_id_foreign";`);

    this.addSql(`alter table "pago" drop constraint "pago_venta_id_foreign";`);

    this.addSql(`alter table "detalle" drop constraint "detalle_venta_id_foreign";`);
  }

}
