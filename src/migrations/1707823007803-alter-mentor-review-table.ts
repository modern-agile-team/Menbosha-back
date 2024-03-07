import { generateBooleanColumn } from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterMentorReviewTable1707823007803 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('mentor_review', [
      new TableColumn(generateBooleanColumn('is_good_work', '잘가르쳐요')),
      new TableColumn(generateBooleanColumn('is_clear', '깔끔해요')),
      new TableColumn(generateBooleanColumn('is_quick', '답변이 빨라요')),
      new TableColumn(generateBooleanColumn('is_accurate', '정확해요')),
      new TableColumn(generateBooleanColumn('is_kindness', '친절해요')),
      new TableColumn(generateBooleanColumn('is_fun', '재밌어요')),
      new TableColumn(generateBooleanColumn('is_informative', '알차요')),
      new TableColumn(generateBooleanColumn('is_bad', '아쉬워요')),
      new TableColumn(generateBooleanColumn('is_stuffy', '답답해요')),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('mentor_review', [
      'is_good_work',
      'is_clear',
      'is_quick',
      'is_accurate',
      'is_kindness',
      'is_fun',
      'is_informative',
      'is_bad',
      'is_stuffy',
    ]);
  }
}
