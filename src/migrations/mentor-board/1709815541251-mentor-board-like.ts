import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCreatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MentorBoardLike1709815541251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_board_like',
        columns: [
          generatePrimaryColumn('멘토 게시글 좋아요 고유 ID'),
          generateUserIdColumn(),
          new TableColumn({
            name: 'mentor_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '멘토 게시글 고유 ID',
          }),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_mentor_board_like_mentor_board_id',
            columnNames: ['mentor_board_id'],
            referencedTableName: 'mentor_board',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_mentor_board_like_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE mentor_board_like COMMENT = "멘토 게시글 좋아요"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_board_like');
  }
}
