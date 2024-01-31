import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserRankingEntity1706596603421
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_ranking', ['main_field', 'introduce']);
    await queryRunner.addColumns('user_ranking', [
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
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_ranking', [
      'short_intro',
      'custom_category',
    ]);
    await queryRunner.addColumns('user_ranking', [
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
        comment: '한 줄 소개',
        length: '100',
      }),
    ]);
  }
}
