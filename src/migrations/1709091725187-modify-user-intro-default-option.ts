import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserIntroDefaultOption1709091725187
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user_intro', [
      {
        oldColumn: new TableColumn({
          name: 'short_intro',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'short_intro',
          type: 'varchar',
          isNullable: false,
          default: "'나를 간단하게 소개해봐요.'",
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'career',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'career',
          type: 'varchar',
          isNullable: false,
          default: "'나를 어필할만한 경력을 작성해주세요.'",
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'custom_category',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'custom_category',
          type: 'varchar',
          isNullable: false,
          default: "'나만의 카테고리를 작성해주세요.'",
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'detail',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'detail',
          type: 'varchar',
          isNullable: false,
          default: "'내가 어떤 사람인지 자세하게 작성해주세요.'",
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'portfolio',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'portfolio',
          type: 'varchar',
          isNullable: false,
          default: "'나를 소개할 수 있는 링크가 있다면 추가해주세요.'",
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'sns',
          type: 'varchar',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'sns',
          type: 'varchar',
          isNullable: false,
          default: "'SNS 계정의 링크를 추가해주세요.'",
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user_intro', [
      {
        oldColumn: new TableColumn({
          name: 'short_intro',
          type: 'varchar',
          isNullable: false,
          default: "'나를 간단하게 소개해봐요.'",
        }),
        newColumn: new TableColumn({
          name: 'short_intro',
          type: 'varchar',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'career',
          type: 'varchar',
          isNullable: false,
          default: "'나를 어필할만한 경력을 작성해주세요.'",
        }),
        newColumn: new TableColumn({
          name: 'career',
          type: 'varchar',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'custom_category',
          type: 'varchar',
          isNullable: false,
          default: "'나만의 카테고리를 작성해주세요.'",
        }),
        newColumn: new TableColumn({
          name: 'custom_category',
          type: 'varchar',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'detail',
          type: 'varchar',
          isNullable: false,
          default: "'내가 어떤 사람인지 자세하게 작성해주세요.'",
        }),
        newColumn: new TableColumn({
          name: 'detail',
          type: 'varchar',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'portfolio',
          type: 'varchar',
          isNullable: false,
          default: "'나를 소개할 수 있는 링크가 있다면 추가해주세요.'",
        }),
        newColumn: new TableColumn({
          name: 'portfolio',
          type: 'varchar',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'sns',
          type: 'varchar',
          isNullable: false,
          default: "'SNS 계정의 링크를 추가해주세요.'",
        }),
        newColumn: new TableColumn({
          name: 'sns',
          type: 'varchar',
          isNullable: true,
        }),
      },
    ]);
  }
}
