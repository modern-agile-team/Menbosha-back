import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyMentorReviewChecklistCountSchema1707370531264
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'mentor_review_checklist_count',
      'createdAt',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: '생성일자',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'mentor_review_checklist_count',
      'created_at',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      }),
    );
  }
}
