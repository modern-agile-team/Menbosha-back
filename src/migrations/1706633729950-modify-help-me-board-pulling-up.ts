import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyHelpMeBoardPullingUp1706633729950
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'help_me_board',
      'pulling_up',
      new TableColumn({
        name: 'pulling_up',
        isNullable: true,
        type: 'timestamp',
        comment: '끌어올리기 된 일자',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'help_me_board',
      'pulling_up',
      new TableColumn({
        name: 'pulling_up',
        isNullable: false,
        type: 'timestamp',
      }),
    );
  }
}
