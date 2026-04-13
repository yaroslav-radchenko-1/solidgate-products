import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTemplateTable1775847875839 implements MigrationInterface {
  public name = 'CreateTemplateTable1775847875839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "template" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "data" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "template"`);
  }
}
