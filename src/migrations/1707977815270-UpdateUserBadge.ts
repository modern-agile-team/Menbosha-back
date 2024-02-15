import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserBadge1707977815270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_badge',
      'created_at',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: '생성일자',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_badge',
      'created_at',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: '생성일자',
      }),
    );
  }
}
