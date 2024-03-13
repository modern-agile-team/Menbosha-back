import { UserProvider } from '@src/auth/enums/user-provider.enum';
import { UserRole } from '@src/users/constants/user-role.enum';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEnum(UserProvider)
  readonly provider: UserProvider;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  readonly role: UserRole;
}
