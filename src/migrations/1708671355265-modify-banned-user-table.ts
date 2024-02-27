import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ModifyBannedUserTable1708671355265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'banned_user',
      'user_id',
      new TableColumn({
        name: 'ban_user_id',
        type: 'int',
        isNullable: false,
        comment: '밴한 어드민 고유 ID',
      }),
    );

    await queryRunner.addColumn(
      'banned_user',
      new TableColumn({
        isUnique: true,
        name: 'banned_user_id',
        type: 'int',
        isNullable: false,
        comment: '밴 당한 유저 고유 ID',
      }),
    );

    await queryRunner.createForeignKey(
      'banned_user',
      new TableForeignKey({
        name: 'fk_banned_user_id',
        columnNames: ['banned_user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'banned_user',
      'ban_user_id',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        isNullable: false,
        comment: '유저 고유 ID',
      }),
    );

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.banned_user DROP FOREIGN KEY fk_banned_user_id;',
    );

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.banned_user DROP KEY IDX_7a417d9ade1a42e5a3848157f4;',
    );

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.banned_user DROP COLUMN banned_user_id;',
    );
  }
}
