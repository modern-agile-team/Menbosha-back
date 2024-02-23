import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserUniqueIdInUserTable1708659903406
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'unique_id',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'unique_id');
  }
}
