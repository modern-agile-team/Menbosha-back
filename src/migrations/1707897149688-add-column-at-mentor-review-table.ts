import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { generateBooleanColumn } from './__utils/util';

export class AddColumnAtMentorReviewTable1707897149688
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mentor_review',
      new TableColumn(
        generateBooleanColumn('is_understand_well', '이해가 잘돼요'),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mentor_review', 'is_understand_well');
  }
}
