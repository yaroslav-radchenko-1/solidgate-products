import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingTable1775738067783 implements MigrationInterface {
  public name = 'CreateSettingTable1775738067783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting" ("key" varchar PRIMARY KEY NOT NULL, "value" text NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
