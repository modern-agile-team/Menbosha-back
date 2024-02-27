import {
  generateBooleanColumn,
  generatePrimaryColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DropMentorReviewChecklistTable1707822958189
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_review_checklist');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_review_checklist',
        columns: [
          generatePrimaryColumn('멘토 리뷰 체크리스트 고유 ID'),
          {
            name: 'mentor_review_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '멘토 리뷰 고유 ID',
          },
          generateBooleanColumn('is_good_work', '잘가르쳐요'),
          generateBooleanColumn('is_clear', '깔끔해요'),
          generateBooleanColumn('is_quick', '답변이 빨라요'),
          generateBooleanColumn('is_accurate', '정확해요'),
          generateBooleanColumn('is_kindness', '친절해요'),
          generateBooleanColumn('is_fun', '재밌어요'),
          generateBooleanColumn('is_informative', '알차요'),
          generateBooleanColumn('is_bad', '아쉬워요'),
          generateBooleanColumn('is_stuffy', '답답해요'),
        ],
        foreignKeys: [
          {
            referencedTableName: 'mentor_review',
            referencedColumnNames: ['id'],
            columnNames: ['mentor_review_id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE mentor_review_checklist COMMENT = "멘토 리뷰 체크리스트"',
    );
  }
}
