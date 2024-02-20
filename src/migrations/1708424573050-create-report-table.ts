import { generatePrimaryColumn } from 'src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateReportTable1708424573050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report',
        columns: [
          generatePrimaryColumn('신고 고유 ID'),
          new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: false,
            comment: '유저 고유 ID',
          }),
          new TableColumn({
            name: 'type',
            type: 'enum',
            isNullable: false,
            comment: '유저 고유 ID',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
