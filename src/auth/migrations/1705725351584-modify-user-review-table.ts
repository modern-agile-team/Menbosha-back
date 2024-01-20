import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableColumnOptions,
} from 'typeorm';

const generatePrimaryColumn = (
  comment: string = '고유 ID',
): TableColumnOptions => {
  return {
    name: 'id',
    type: 'int',
    unsigned: true,
    isPrimary: true,
    isNullable: false,
    isGenerated: true,
    generationStrategy: 'increment',
    comment,
  };
};

const generateBooleanColumn = (
  name: string,
  comment: string,
): TableColumnOptions => {
  return {
    name: name,
    type: 'tinyint',
    length: '1',
    unsigned: true,
    default: 0,
    isNullable: false,
    comment: comment,
  };
};

export class ModifyUserReviewTable1705725351584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user_review', 'mentor_review');

    // 리뷰 테이블 created_at 추가
    await queryRunner.addColumn(
      'mentor_review',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: '생성일자',
      }),
    );

    // 체크리스트 테이블
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'mentor_review',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
      }),
    );
    await queryRunner.dropTable(new Table({ name: 'mentor_review_checklist' }));
  }
}
