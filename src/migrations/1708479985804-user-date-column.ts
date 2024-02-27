import {
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserDateColumn1708479985804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn(generateCreatedAtColumn()),
      new TableColumn(generateUpdatedAtColumn()),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['created_at', 'updated_at']);
  }
}
