import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCreatedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserBadge1709815418532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_badge',
        columns: [
          generatePrimaryColumn('유저 뱃지 매핑테이블 고유 ID'),
          generateUserIdColumn('뱃지 획득한 유저 고유 ID'),
          new TableColumn({
            name: 'badge_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '뱃지 고유 ID',
          }),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_user_badge_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_user_badge_badge_id',
            columnNames: ['badge_id'],
            referencedTableName: 'badge',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE user_badge COMMENT = "유저 뱃지 매핑 테이블"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_badge');
  }
}
