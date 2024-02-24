import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyBannedUserTable1708766260162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'banned_user',
      'end_at',
      new TableColumn({
        name: 'end_at',
        type: 'datetime',
        isNullable: false,
        comment: '정지가 끝나는 날짜',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'banned_user',
      'end_at',
      new TableColumn({
        name: 'end_at',
        type: 'timestamp',
        isNullable: false,
        comment: '정지가 끝나는 날짜',
      }),
    );
  }
}
