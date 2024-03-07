import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ModifyReportTable1708498015531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'report',
      'user_id',
      new TableColumn({
        name: 'report_user_id',
        type: 'int',
        isNullable: false,
        comment: '신고한 유저 고유 ID',
      }),
    );

    await queryRunner.addColumn(
      'report',
      new TableColumn({
        name: 'reported_user_id',
        type: 'int',
        isNullable: false,
        comment: '신고 당한 유저 ID',
      }),
    );

    await queryRunner.createForeignKey(
      'report',
      new TableForeignKey({
        columnNames: ['reported_user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'report',
      'report_user_id',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        isNullable: false,
        comment: '유저 고유 ID',
      }),
    );

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.report DROP FOREIGN KEY FK_798954c041abe4b92a8f47d6638;',
    );

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.report DROP COLUMN reported_user_id;',
    );
  }
}
