import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCreatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserImage1709815441214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_image',
        columns: [
          generatePrimaryColumn('유저 이미지 고유 ID'),
          generateUserIdColumn('유저 고유 ID'),
          new TableColumn({
            name: 'image_url',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '이미지 url',
          }),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_user_image_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
        uniques: [{ name: 'UQ_user_image_user_id', columnNames: ['user_id'] }],
      }),
    );

    await queryRunner.query('ALTER TABLE user_image COMMENT = "유저 이미지"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_image');
  }
}
