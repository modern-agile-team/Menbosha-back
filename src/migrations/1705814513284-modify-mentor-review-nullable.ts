import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyMentorReviewNullable1705814513284
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.changeColumn(
      'mentor_review',
      'review',
      new TableColumn({
        isNullable: true,
        length: '255',
        name: 'review',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.changeColumn(
      'mentor_review',
      'review',
      new TableColumn({
        length: '255',
        name: 'review',
        type: 'varchar',
      }),
    );
  }
}
