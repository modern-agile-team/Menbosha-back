import {
  generatePrimaryColumn,
  generateCreatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MentorBoardImage1709815530689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mentor_board_image',
        columns: [
          generatePrimaryColumn('멘토 게시글 이미지 고유 ID'),
          new TableColumn({
            name: 'mentor_board_id',
            unsigned: true,
            isNullable: false,
            type: 'int',
            comment: '멘토 게시글 고유 ID',
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
            name: 'FK_mentor_board_image_mentor_board_id',
            columnNames: ['mentor_board_id'],
            referencedTableName: 'mentor_board',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE mentor_board_image COMMENT = "멘토 게시글 이미지"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mentor_board_image');
  }
}
