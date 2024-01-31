import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MentorReviewSoftDelete1705836905872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mentor_review',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mentor_review', 'deleted_at');
  }
}
