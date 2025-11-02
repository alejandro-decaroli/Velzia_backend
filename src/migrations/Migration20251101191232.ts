import { Migration } from '@mikro-orm/migrations';

export class Migration20251101191232 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "producto" drop constraint "producto_nombre_unique";`);

    this.addSql(`alter table "aporte" drop column "nombre_caja";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "producto" add constraint "producto_nombre_unique" unique ("nombre");`);

    this.addSql(`alter table "aporte" add column "nombre_caja" varchar(255) not null default '';`);
  }

}
