import { Category } from '@src/category/entity/category-list.entity';
import { generatePrimaryColumn } from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Category1709815316486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          generatePrimaryColumn('카테고리 고유 ID'),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '카테고리 이름',
          }),
        ],
      }),
    );

    await queryRunner.manager.getRepository(Category).upsert(
      [
        {
          name: '전체',
        },
        {
          name: 'IT',
        },
        {
          name: '요리',
        },
        {
          name: '디자인',
        },
        {
          name: '운동',
        },
        {
          name: '패션/뷰티',
        },
        {
          name: '게임',
        },
        {
          name: '음악',
        },
        {
          name: '반려동물',
        },
        {
          name: '회화',
        },
        {
          name: '육아',
        },
        {
          name: '공부',
        },
        {
          name: '그 외',
        },
      ],
      ['name'],
    );

    await queryRunner.query('ALTER TABLE category COMMENT = "카테고리"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('category');
  }
}
