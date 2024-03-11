import {
  generatePrimaryColumn,
  generateUserIdColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserIntro1709815451208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_intro',
        columns: [
          generatePrimaryColumn('유저 인트로'),
          generateUserIdColumn(),
          new TableColumn({
            name: 'career',
            type: 'varchar',
            length: '200',
            isNullable: false,
            default: "'나를 어필할만한 경력을 작성해주세요.'",
            comment: '유저 커리어',
          }),
          new TableColumn({
            name: 'short_intro',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'나를 간단하게 소개해봐요.'",
            comment: '유저 짧은 소개',
          }),
          new TableColumn({
            name: 'custom_category',
            type: 'varchar',
            length: '200',
            isNullable: false,
            default: "'나만의 카테고리를 작성해주세요.'",
            comment: '유저 커스텀 카테고리',
          }),
          new TableColumn({
            name: 'detail',
            type: 'varchar',
            length: '200',
            isNullable: false,
            default: "'내가 어떤 사람인지 자세하게 작성해주세요.'",
            comment: '유저 상세 소개',
          }),
          new TableColumn({
            name: 'portfolio',
            type: 'varchar',
            length: '100',
            isNullable: false,
            default: "'나를 소개할 수 있는 링크가 있다면 추가해주세요.'",
            comment: '유저 포트폴리오',
          }),
          new TableColumn({
            name: 'sns',
            type: 'varchar',
            length: '100',
            isNullable: false,
            default: "'SNS 계정의 링크를 추가해주세요.'",
            comment: '유저 SNS 링크',
          }),
        ],
        foreignKeys: [
          {
            name: 'FK_user_intro_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [{ name: 'UQ_user_intro_user_id', columnNames: ['user_id'] }],
      }),
    );

    await queryRunner.query('ALTER TABLE user_intro COMMENT = "유저 소개"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_intro');
  }
}
