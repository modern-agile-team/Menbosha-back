import { generateDeletedAtColumn } from 'src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class BoardsSoftDelete1708479086561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'help_me_board',
      new TableColumn(generateDeletedAtColumn()),
    );

    await queryRunner.addColumn(
      'help_you_comment',
      new TableColumn(generateDeletedAtColumn()),
    );

    await queryRunner.addColumn(
      'mentor_board',
      new TableColumn(generateDeletedAtColumn()),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('help_me_board', 'deleted_at');
    await queryRunner.dropColumn('help_you_comment', 'deleted_at');
    await queryRunner.dropColumn('mentor_board', 'deleted_at');
  }
}
