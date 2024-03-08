import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCreatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class HelpYouComment1709815618210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'help_you_comment',
        columns: [
          generatePrimaryColumn('도와줄게요 댓글 고유 ID'),
          generateUserIdColumn('도와줄게요 댓글 작성자 고유 ID'),
          new TableColumn({
            name: 'help_me_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '도와주세요 게시글 고유 ID',
          }),
          generateCreatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_help_you_comment_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_help_you_comment_help_me_board_id',
            columnNames: ['help_me_board_id'],
            referencedTableName: 'help_me_board',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE help_you_comment COMMENT = "도와줄게요 댓글"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('help_you_comment');
  }
}
