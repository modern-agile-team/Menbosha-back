import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCategoryIdColumn,
  generateHeadColumn,
  generateBodyColumn,
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MentorBoard1709815523855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_board',
        columns: [
          generatePrimaryColumn('멘토 게시글 고유 ID'),
          generateUserIdColumn('멘토 게시글 작성자 고유 ID'),
          generateCategoryIdColumn(),
          generateHeadColumn('멘토 게시글 제목'),
          generateBodyColumn('멘토 게시글 본문'),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          new TableColumn({
            name: 'popular_at',
            type: 'timestamp',
            isNullable: true,
            comment: '인기 게시글 선정 시간',
          }),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_mentor_board_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_mentor_board_category_id',
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
      'ALTER TABLE mentor_board ADD FULLTEXT INDEX IDX_fulltext_head_body (head, body) WITH PARSER ngram',
    );

    await queryRunner.query('ALTER TABLE mentor_board COMMENT = "멘토 게시판"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_board');
  }
}
