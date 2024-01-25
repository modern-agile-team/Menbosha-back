import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserIntroEntity1706078088801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_intro', ['main_field', 'introduce']);
    await queryRunner.addColumns('user_intro', [
      new TableColumn({
        name: 'short_intro',
        type: 'varchar',
        isNullable: true,
        comment: '한 줄 소개',
        length: '100',
      }),
      new TableColumn({
        name: 'custom_category',
        type: 'varchar',
        isNullable: true,
        comment: '사용자 정의 카테고리',
        length: '100',
      }),
      new TableColumn({
        name: 'detail',
        type: 'varchar',
        isNullable: true,
        comment: '상세 소개',
        length: '3000',
      }),
      new TableColumn({
        name: 'portfolio',
        type: 'varchar',
        isNullable: true,
        comment: '포트폴리오',
        length: '255',
      }),
      new TableColumn({
        name: 'sns',
        type: 'varchar',
        isNullable: true,
        comment: 'SNS',
        length: '255',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_intro', [
      'short_intro',
      'custom_category',
      'detail',
      'portfolio',
      'sns',
    ]);
    await queryRunner.addColumns('user_intro', [
      new TableColumn({
        name: 'main_field',
        type: 'varchar',
        isNullable: true,
        comment: '주 분야',
        length: '100',
      }),
      new TableColumn({
        name: 'introduce',
        type: 'varchar',
        isNullable: true,
        comment: '소개',
        length: '3000',
      }),
    ]);
  }
}
