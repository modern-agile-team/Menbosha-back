import { generateDeletedAtColumn } from '@src/migrations/__utils/util';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SoftDeleteUser1708423002121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
        default: `'${UserStatus.ACTIVE}'`,
        isNullable: false,
        comment: '유저 상태',
      }),
      new TableColumn(generateDeletedAtColumn()),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['status', 'deleted_at']);
  }
}
