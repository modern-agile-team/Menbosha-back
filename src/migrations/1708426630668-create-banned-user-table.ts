import { generatePrimaryColumn } from 'src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateBannedUserTable1708426630668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banned_user',
        columns: [
          generatePrimaryColumn('밴된 유저 테이블 데이터 고유 ID'),
          new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: false,
            comment: '유저 고유 ID',
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
            type: 'timestamp',
            isNullable: false,
            comment: '정지가 끝나는 날짜',
          }),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
