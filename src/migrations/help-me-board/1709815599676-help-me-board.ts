import {
  generatePrimaryColumn,
  generateCategoryIdColumn,
  generateUserIdColumn,
  generateHeadColumn,
  generateBodyColumn,
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class HelpMeBoard1709815599676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'help_me_board',
        columns: [
          generatePrimaryColumn('도와주세요 게시글 고유 ID'),
          generateCategoryIdColumn(),
          generateUserIdColumn('게시글 작성 고유 ID'),
          generateHeadColumn('도와주세요 게시글 제목'),
          generateBodyColumn('도와주세요 게시글 본문'),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          new TableColumn({
            name: 'pulling_up',
            type: 'timestamp',
            isNullable: true,
            comment: '도와주세요 게시글 끌어올리기 일시',
          }),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_help_me_board_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_help_me_board_category_id',
            columnNames: ['category_id'],
            referencedTableName: 'category',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE help_me_board ADD FULLTEXT INDEX IDX_fulltext_head_body (head, body) WITH PARSER ngram',
    );

    await queryRunner.query(
      'ALTER TABLE help_me_board COMMENT = "도와주세요 게시판"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('help_me_board');
  }
}
