import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyHelpMeBoard1706170493036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new column for helpYouComments
    await queryRunner.query(`
      ALTER TABLE help_me_board
      ADD COLUMN help_you_comments_id INTEGER;
      
      ALTER TABLE help_me_board
      ADD CONSTRAINT fk_help_you_comments
      FOREIGN KEY (help_you_comments_id)
      REFERENCES help_you_comment(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new column and foreign key constraint
    await queryRunner.query(`
      ALTER TABLE help_me_board
      DROP COLUMN help_you_comments_id;
      
      ALTER TABLE help_me_board
      DROP CONSTRAINT fk_help_you_comments;
    `);
  }
}
