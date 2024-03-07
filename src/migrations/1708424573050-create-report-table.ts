import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generatePrimaryColumn,
} from '@src/migrations/__utils/util';
import { ReportType } from '@src/reports/constants/report-type.enum';
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
            enum: [
              ReportType.HateSpeech,
              ReportType.IllegalPost,
              ReportType.PromotionalPost,
            ],
            isNullable: false,
            comment: '신고 타입',
          }),
          new TableColumn({
            name: 'reason',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '신고 상세 사유',
          }),
          generateCreatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query('ALTER TABLE report COMMENT = "신고 테이블"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report');
  }
}
