import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserRanking1709815481669 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_ranking',
        columns: [
          generatePrimaryColumn('유저 랭킹 고유 ID'),
          generateUserIdColumn(),
          new TableColumn({
            name: 'activity_category_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: '유저 활동 카테고리 고유 ID',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '유저 이름',
          }),
          new TableColumn({
            name: 'career',
            type: 'varchar',
            length: '200',
            isNullable: true,
            comment: '유저 커리어',
          }),
          new TableColumn({
            name: 'rank',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: '유저 랭크',
          }),
          new TableColumn({
            name: 'review_count',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: '유저 리뷰받은 개수',
          }),
          new TableColumn({
            name: 'short_intro',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: '유저 짧은 소개',
          }),
          new TableColumn({
            name: 'custom_category',
            type: 'varchar',
            length: '200',
            isNullable: true,
            comment: '유저 짧은 소개',
          }),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_user_ranking_user_id',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_user_ranking_activity_category_id',
            columnNames: ['activity_category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_user_ranking_user_id',
            columnNames: ['user_id'],
          },
        ],
      }),
    );

    await queryRunner.query('ALTER TABLE user COMMENT = "유저 랭킹"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_ranking');
  }
}
