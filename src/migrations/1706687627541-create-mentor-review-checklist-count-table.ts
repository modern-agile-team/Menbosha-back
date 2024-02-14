import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  generateCountColumn,
  generateCreatedAtColumn,
  generatePrimaryColumn,
} from './__utils/util';

export class CreateMentorReviewChecklistCountTable1706687627541
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_review_checklist_count',
        columns: [
          generatePrimaryColumn('멘토 리뷰 체크리스트 카운트 고유ID'),
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
            comment: '멘토 리뷰 체크리스트 카운트 유저 고유 ID',
          },
          generateCountColumn('is_good_work_count', '잘가르쳐요'),
          generateCountColumn('is_clear_count', '깔끔해요'),
          generateCountColumn('is_quick_count', '답변이 빨라요'),
          generateCountColumn('is_accurate_count', '정확해요'),
          generateCountColumn('is_kindness_count', '친절해요'),
          generateCountColumn('is_fun_count', '재밌어요'),
          generateCountColumn('is_informative_count', '알차요'),
          generateCountColumn('is_bad_count', '아쉬워요'),
          generateCountColumn('is_stuffy_count', '답답해요'),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE mentor_review_checklist_count COMMENT = "멘토 리뷰 체크리스트 카운트"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_review_checklist_count');
  }
}