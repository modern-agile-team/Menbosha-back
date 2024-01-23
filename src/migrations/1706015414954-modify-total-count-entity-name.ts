import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTotalCountEntityName1706015414954
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'total_count',
      'mentor_board_count_7days',
      'mentor_board_count_in_seven_days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'help_you_comment_count_7days',
      'help_you_comment_count_in_seven_days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'mentor_board_like_count_7days',
      'mentor_board_like_count_in_seven_days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'badge_count_7days',
      'badge_count_in_seven_days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'review_count_7days',
      'review_count_in_seven_days',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'total_count',
      'mentor_board_count_in_seven_days',
      'mentor_board_count_7days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'help_you_comment_count_in_seven_days',
      'help_you_comment_count_7days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'mentor_board_like_count_in_seven_days',
      'mentor_board_like_count_7days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'badge_count_in_seven_days',
      'badge_count_7days',
    );
    await queryRunner.renameColumn(
      'total_count',
      'review_count_in_seven_days',
      'review_count_7days',
    );
  }
}
