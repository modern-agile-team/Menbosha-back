import { Badge } from '@src/entities/Badge';
import { generatePrimaryColumn } from '@src/migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class Badge1709815357848 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'badge',
        columns: [
          generatePrimaryColumn('뱃지 고유 ID'),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '30',
            isNullable: false,
          }),
          new TableColumn({
            name: 'memo',
            type: 'varchar',
            isNullable: true,
          }),
        ],
      }),
    );

    const nameMemoFactory = (
      name: string,
      checklist: string,
      count: number,
    ): QueryDeepPartialEntity<Badge> => {
      return {
        name,
        memo: `${checklist} ${count}번 이상 달성 시`,
      };
    };

    await queryRunner.manager
      .getRepository(Badge)
      .upsert(
        [
          nameMemoFactory('친절한 멘토씨', '친절해요', 5),
          nameMemoFactory('가는 말이 좋아야', '친절해요', 10),
          nameMemoFactory('친절해요 25', '친절해요', 25),
          nameMemoFactory('친절해요 50', '친절해요', 50),
          nameMemoFactory('이 사람은 보살이에요!', '친절해요', 100),
          nameMemoFactory('잘 가르쳐줘요 5', '잘 가르쳐줘요', 5),
          nameMemoFactory('선생님의 은혜', '잘 가르쳐줘요', 10),
          nameMemoFactory('잘 가르쳐줘요 25', '잘 가르쳐줘요', 25),
          nameMemoFactory('잘 가르쳐줘요 50', '잘 가르쳐줘요', 50),
          nameMemoFactory('명품 강사가 떴다!', '잘 가르쳐줘요', 100),
          nameMemoFactory('깔끔해요 5', '깔끔해요', 5),
          nameMemoFactory('혹시 T?', '깔끔해요', 10),
          nameMemoFactory('깔끔해요 25', '깔끔해요', 25),
          nameMemoFactory('깔끔해요 50', '깔끔해요', 50),
          nameMemoFactory('깔끔함의 대명사', '깔끔해요', 100),
          nameMemoFactory('답변이 빨라요 5', '답변이 빨라요', 5),
          nameMemoFactory('번개맨', '답변이 빨라요', 10),
          nameMemoFactory('답변이 빨라요 25', '답변이 빨라요', 25),
          nameMemoFactory('답변이 빨라요 50', '답변이 빨라요', 50),
          nameMemoFactory('빛의 속도 도달함', '답변이 빨라요', 100),
          nameMemoFactory('신입 궁수', '정확해요', 5),
          nameMemoFactory('백발백중 명사수', '정확해요', 10),
          nameMemoFactory('정확해요 25', '정확해요', 25),
          nameMemoFactory('정확해요 50', '정확해요', 50),
          nameMemoFactory('정확해요 100', '정확해요', 100),
          nameMemoFactory('영재', '이해가 빨라요', 5),
          nameMemoFactory('아이큐 최소 150', '이해가 빨라요', 10),
          nameMemoFactory('이해가 빨라요 25', '이해가 빨라요', 25),
          nameMemoFactory('이해가 빨라요 50', '이해가 빨라요', 50),
          nameMemoFactory('만능의 노트', '이해가 빨라요', 100),
          nameMemoFactory('즐거운 사람', '재밌어요', 5),
          nameMemoFactory('드립력 MAX', '재밌어요', 10),
          nameMemoFactory('재밌어요 25', '재밌어요', 25),
          nameMemoFactory('재밌어요 50', '재밌어요', 50),
          nameMemoFactory('개그의 신', '재밌어요', 100),
          nameMemoFactory('알차요 5', '알차요', 5),
          nameMemoFactory('알차서 맛있다', '알차요', 10),
          nameMemoFactory('알차요 25', '알차요', 25),
          nameMemoFactory('알차요 50', '알차요', 50),
          nameMemoFactory('유명한 미슐랭', '알차요', 100),
        ],
        ['name'],
      );

    await queryRunner.query('ALTER TABLE badge COMMENT = "뱃지"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('badge');
  }
}
