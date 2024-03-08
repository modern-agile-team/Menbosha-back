import {
  generatePrimaryColumn,
  generateCreatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class HelpMeBoardImage1709815610192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'help_me_board_image',
        columns: [
          generatePrimaryColumn('도와주세요 게시글 이미지 고유 ID'),
          new TableColumn({
            name: 'help_me_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '도와주세요 게시글 고유 ID',
          }),
          new TableColumn({
            name: 'image_url',
            type: 'varchar',
            length: '100',
            isNullable: false,
            comment: '이미지 url',
          }),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_help_me_board_image_help_me_board_id',
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
      'ALTER TABLE help_me_board_image COMMENT = "도와주세요 게시글 이미지"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('help_me_board_image');
  }
}
