import { UserRole } from '@src/users/constants/user-role.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserRoleTypeAndNameConvention1708753315170
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user', [
      {
        oldColumn: new TableColumn({
          name: 'isMentor',
          type: 'tinyint',
        }),
        newColumn: new TableColumn({
          name: 'is_mentor',
          type: 'tinyint',
          default: 0,
          unsigned: true,
          length: '1',
          isNullable: false,
          comment: '멘토 여부 (0: 멘티, 1: 멘토)',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'admin',
          type: 'tinyint',
        }),
        newColumn: new TableColumn({
          name: 'role',
          type: 'enum',
          enum: [UserRole.ADMIN, UserRole.USER],
          default: `'${UserRole.USER}'`,
          isNullable: false,
          comment: '유저 역할',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('user', [
      {
        oldColumn: new TableColumn({
          name: 'is_mentor',
          type: 'tinyint',
          default: 0,
          unsigned: true,
          length: '1',
          isNullable: false,
          comment: '멘토 여부 (0: 멘티, 1: 멘토)',
        }),
        newColumn: new TableColumn({
          name: 'isMentor',
          type: 'tinyint',
          default: 0,
          length: '1',
          isNullable: false,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'role',
          type: 'enum',
          enum: [UserRole.ADMIN, UserRole.USER],
          default: `'${UserRole.USER}'`,
          isNullable: false,
          comment: '유저 역할',
        }),
        newColumn: new TableColumn({
          name: 'admin',
          type: 'tinyint',
          default: 0,
          length: '1',
          isNullable: false,
        }),
      },
    ]);
  }
}
