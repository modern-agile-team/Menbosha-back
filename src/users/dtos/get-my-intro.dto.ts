import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from '../entities/user-intro.entity';
import { Exclude } from 'class-transformer';

export class MyIntroDto implements Omit<UserIntro, 'user'> {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @ApiProperty({
    description: '하고 싶은 말',
  })
  mainField: string;

  @ApiProperty({
    description: '소개',
  })
  introduce: string;

  @ApiProperty({
    description: '경력',
  })
  career: string;

  constructor(myIntro: Partial<MyIntroDto> = {}) {
    Object.assign(this, myIntro);
  }
}
