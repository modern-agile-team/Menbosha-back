import { UserProvider } from '@src/auth/enums/user-provider.enum';
import {
  generatePrimaryColumn,
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class User1709815403239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          generatePrimaryColumn('유저 고유 ID'),
          new TableColumn({
            name: 'hope_category_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            default: 1,
            comment: '유저 희망 카테고리 고유 ID',
          }),
          new TableColumn({
            name: 'activity_category_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            default: 1,
            comment: '유저 활동 카테고리 고유 ID',
          }),
          new TableColumn({
            name: 'provider',
            type: 'enum',
            enum: [UserProvider.Google, UserProvider.Kakao, UserProvider.Naver],
            isNullable: false,
            comment: '유저 제공자',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '유저 이름',
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: '유저 이메일',
          }),
          new TableColumn({
            name: 'rank',
            type: 'smallint',
            length: '3',
            unsigned: true,
            isNullable: false,
            default: 10,
            comment: '유저 랭크',
          }),
          new TableColumn({
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '유저 핸드폰 번호',
          }),
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
            default: `'${UserStatus.ACTIVE}'`,
            isNullable: false,
            comment: '유저 상태',
          }),
          new TableColumn({
            name: 'unique_id',
            type: 'varchar',
            length: '100',
            isNullable: false,
          }),
          new TableColumn({
            name: 'is_mentor',
            type: 'tinyint',
            length: '1',
            unsigned: true,
            default: 0,
            isNullable: false,
            comment: '멘토 여부 (0: 멘티, 1: 멘토)',
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            enum: [UserRole.ADMIN, UserRole.USER],
            isNullable: false,
            default: `'${UserRole.USER}'`,
          }),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_user_activity_category_id',
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
            columnNames: ['activity_category_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_user_hope_category_id',
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
            columnNames: ['hope_category_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE user ADD FULLTEXT INDEX IDX_fulltext_name (name) WITH PARSER ngram',
    );

    await queryRunner.query(
      'ALTER TABLE user ADD UNIQUE KEY UQ_user_unique_id (unique_id)',
    );

    await queryRunner.query('ALTER TABLE user COMMENT = "유저"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
