import {
  generatePrimaryColumn,
  generateCountColumn,
  generateCreatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MentorReviewChecklistCount1709815664762
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_review_checklist_count',
        columns: [
          generatePrimaryColumn('멘토 리뷰 체크리스트 카운트 고유ID'),
          new TableColumn({
            name: 'mentor_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '멘토 리뷰 체크리스트 카운트 소유 멘토 고유 ID',
          }),
          generateCountColumn('is_good_work_count', '잘가르쳐요'),
          generateCountColumn('is_clear_count', '깔끔해요'),
          generateCountColumn('is_quick_count', '답변이 빨라요'),
          generateCountColumn('is_accurate_count', '정확해요'),
          generateCountColumn('is_kindness_count', '친절해요'),
          generateCountColumn('is_fun_count', '재밌어요'),
          generateCountColumn('is_informative_count', '알차요'),
          generateCountColumn('is_bad_count', '아쉬워요'),
          generateCountColumn('is_stuffy_count', '답답해요'),
          generateCountColumn('is_understand_well_count', '이해가 잘돼요'),
          generateCreatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_mentor_review_checklist_count_mentor_id',
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['mentor_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE mentor_review_checklist_count ADD UNIQUE KEY UQ_mentor_review_checklist_count_mentor_id (mentor_id)',
    );

    await queryRunner.query(
      'ALTER TABLE mentor_review_checklist_count COMMENT = "멘토 리뷰 체크리스트 카운트"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_review_checklist_count');
  }
}
