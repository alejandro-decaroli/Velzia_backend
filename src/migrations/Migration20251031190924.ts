import { Migration } from '@mikro-orm/migrations';

export class Migration20251031190924 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "costo_variable" add column "categoria" varchar(20) not null, add column "unidad" varchar(20) not null, add column "cantidad" numeric(10,4) not null default 0, add column "precio_unitario" numeric(10,4) not null default 0;`);

    this.addSql(`alter table "costo_fijo" add column "categoria" varchar(50) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "costo_variable" drop column "categoria", drop column "unidad", drop column "cantidad", drop column "precio_unitario";`);

    this.addSql(`alter table "costo_fijo" drop column "categoria";`);
  }

}
