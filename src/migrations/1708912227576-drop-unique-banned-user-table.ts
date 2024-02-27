import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class DropUniqueBannedUserTable1708912227576
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE banned_user DROP FOREIGN KEY fk_banned_user_id;',
    );

    await queryRunner.query(
      'ALTER TABLE banned_user DROP KEY IDX_7a417d9ade1a42e5a3848157f4;',
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
    await queryRunner.dropForeignKey('banned_user', 'fk_banned_user_id');

    await queryRunner.query(
      'ALTER TABLE ma6_menbosha_db.banned_user ADD UNIQUE KEY IDX_7a417d9ade1a42e5a3848157f4 (banned_user_id);',
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
}
