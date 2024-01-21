import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MentorReviewChecklistSoftDelete1705843495576
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mentor_review_checklist',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mentor_review_checklist', 'deleted_at');
  }
}
