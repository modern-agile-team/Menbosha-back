import {
  generatePrimaryColumn,
  generateUserIdColumn,
  generateCountColumn,
  generateDeletedAtColumn,
} from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TotalCount1709815758381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'total_count',
        columns: [
          generatePrimaryColumn('토탈 카운트 고유 ID'),
          generateUserIdColumn(),
          generateCountColumn('mentor_board_count', '멘토 게시글 카운트'),
          generateCountColumn(
            'help_you_comment_count',
            '도와줄게요 댓글 카운트',
          ),
          generateCountColumn(
            'mentor_board_like_count',
            '멘토 게시글 좋아요 카운트',
          ),
          generateCountColumn('badge_count', '뱃지 획득 카운트'),
          generateCountColumn('review_count', '리뷰 받은 카운트'),
          generateCountColumn(
            'mentor_board_count_in_seven_days',
            '1주일 내에 멘토 게시글 카운트',
          ),
          generateCountColumn(
            'help_you_comment_count_in_seven_days',
            '1주일 내에 도와줄게요 댓글 카운트',
          ),
          generateCountColumn(
            'mentor_board_like_count_in_seven_days',
            '1주일 내에 멘토 게시글 좋아요 받은 카운트',
          ),
          generateCountColumn(
            'badge_count_in_seven_days',
            '1주일 내에 뱃지 획득 카운트',
          ),
          generateCountColumn(
            'review_count_in_seven_days',
            '1주일 내에 리뷰 받은 카운트',
          ),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            name: 'FK_total_count_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_total_count_user_id',
            columnNames: ['user_id'],
          },
        ],
      }),
    );

    await queryRunner.query('ALTER TABLE total_count COMMENT = "토탈 카운트"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('total_count');
  }
}
