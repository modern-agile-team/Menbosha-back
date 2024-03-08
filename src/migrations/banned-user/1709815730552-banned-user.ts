import { generatePrimaryColumn } from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class BannedUser1709815730552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banned_user',
        columns: [
          generatePrimaryColumn('밴된 유저 테이블 데이터 고유 ID'),
          new TableColumn({
            name: 'ban_user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '밴한 어드민 고유 ID',
          }),
          new TableColumn({
            name: 'banned_user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '밴 당한 유저 고유 ID',
          }),
          new TableColumn({
            name: 'reason',
            type: 'varchar',
            length: '200',
            isNullable: false,
            comment: '정지 사유',
          }),
          new TableColumn({
            name: 'banned_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            comment: '정지 당한 날짜',
          }),
          new TableColumn({
            name: 'end_at',
            type: 'datetime',
            isNullable: true,
            comment: '정지가 끝나는 날짜',
          }),
        ],
        foreignKeys: [
          {
            name: 'fk_banned_user_ban_user_id',
            columnNames: ['ban_user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_banned_user_banned_user_id',
            columnNames: ['banned_user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE `banned_user` COMMENT = "정지 당한 유저 테이블"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('banned_user');
  }
}
