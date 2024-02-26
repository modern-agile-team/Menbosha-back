import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserDefaultOption1708913292118
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user', [
      {
        oldColumn: new TableColumn({
          name: 'hope_category_list_id',
          type: 'int',
        }),
        newColumn: new TableColumn({
          name: 'hope_category_list_id',
          type: 'int',
          default: 1,
          comment: '희망 카테고리 아이디',
          unsigned: true,
          isNullable: false,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'activity_category_list_id',
          type: 'int',
        }),
        newColumn: new TableColumn({
          name: 'activity_category_list_id',
          type: 'int',
          default: 1,
          comment: '활동 카테고리 아이디',
          unsigned: true,
          isNullable: false,
        }),
      },
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user', [
      {
        oldColumn: new TableColumn({
          name: 'hope_category_list_id',
          type: 'int',
          default: 1,
          comment: '희망 카테고리 아이디',
          unsigned: true,
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'hope_category_list_id',
          type: 'int',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'activity_category_list_id',
          type: 'int',
          default: 1,
          comment: '활동 카테고리 아이디',
          unsigned: true,
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'activity_category_list_id',
          type: 'int',
        }),
      },
    ]);
  }
}
