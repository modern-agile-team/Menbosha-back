import {
  generatePrimaryColumn,
  generateBooleanColumn,
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MentorReview1709815658538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_review',
        columns: [
          generatePrimaryColumn('멘토 리뷰 고유 ID'),
          new TableColumn({
            name: 'mentor_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '멘토 고유 ID',
          }),
          new TableColumn({
            name: 'mentee_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '멘티 고유 ID',
          }),
          new TableColumn({
            name: 'review',
            type: 'varchar',
            length: '200',
            isNullable: true,
            comment: '멘토링 상세 후기',
          }),
          generateBooleanColumn('is_good_work', '잘가르쳐요'),
          generateBooleanColumn('is_clear', '깔끔해요'),
          generateBooleanColumn('is_quick', '답변이 빨라요'),
          generateBooleanColumn('is_accurate', '정확해요'),
          generateBooleanColumn('is_kindness', '친절해요'),
          generateBooleanColumn('is_fun', '재밌어요'),
          generateBooleanColumn('is_informative', '알차요'),
          generateBooleanColumn('is_bad', '아쉬워요'),
          generateBooleanColumn('is_stuffy', '답답해요'),
          generateBooleanColumn('is_understand_well', '이해가 잘돼요'),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_mentor_review_mentor_id',
            columnNames: ['mentor_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_mentor_review_mentee_id',
            columnNames: ['mentee_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query('ALTER TABLE mentor_review COMMENT = "멘토 리뷰"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_review');
  }
}
