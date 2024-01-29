import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class ModifyHelpMeBoardComment1706491586604
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 외래 키 제약 조건 추가
    await queryRunner.createForeignKey(
      'help_you_comment', // help_you_comment 테이블
      new TableForeignKey({
        columnNames: ['help_me_board_id'], // help_me_board_id 칼럼이 있어야 하는 경우에 사용 (테이블에 따라 다를 수 있음)
        referencedColumnNames: ['id'],
        referencedTableName: 'help_me_board',
        onDelete: 'CASCADE',
        name: 'fk_help_me_board',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 외래 키 제약 조건 제거
    await queryRunner.dropForeignKey('help_you_comment', 'fk_help_me_board');
  }
}
