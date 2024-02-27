import { generateUpdatedAtColumn } from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUpdatedAtMentorReviewTable1707839631749
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mentor_review',
      new TableColumn(generateUpdatedAtColumn()),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mentor_review', 'updated_at');
  }
}
