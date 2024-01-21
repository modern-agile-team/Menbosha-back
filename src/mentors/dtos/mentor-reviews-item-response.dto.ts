import { MentorReviewDto } from './mentor-review.dto';
import { MentorReviewChecklistDto } from './mentor-review-checklist.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from 'src/users/dtos/user-info.dto';
import { UserImage } from 'src/users/entities/user-image.entity';
import { UserIntro } from 'src/users/entities/user-intro.entity';

class UserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    default: '유저 image url',
  })
  imageUrl: string;
}

class UserIntroDto
  implements Pick<UserIntro, 'mainField' | 'career' | 'introduce'>
{
  @ApiProperty({
    description: '대표 멘토링 분야',
  })
  mainField: string;

  @ApiProperty({
    description: '유저 커리어',
  })
  career: string;

  @ApiProperty({
    description: '멘토 소개',
  })
  introduce: string;
}

class Mentee implements Pick<UserInfoDto, 'id' | 'name' | 'rank'> {
  @ApiProperty({
    description: '유저 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저 랭크',
  })
  rank: number;

  @ApiProperty({
    description: '유저 랭크',
  })
  userImage: UserImageDto;

  @ApiProperty({
    description: '유저 소개 객체',
    type: UserIntroDto,
    nullable: true,
  })
  userIntro: UserIntroDto | null;
}

export class MentorReviewsItemResponseDto
  implements Omit<MentorReviewDto, 'mentorId' | 'menteeId'>
{
  @ApiProperty({
    description: '멘토 리뷰 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '리뷰를 작성한 유저의 정보 객체',
  })
  mentee: Mentee;

  @ApiProperty({
    description: '멘티가 작성한 리뷰',
    nullable: true,
    type: () => String,
  })
  review: string | null;

  @ApiProperty({
    description: '멘티가 작성한 리뷰 체크리스트',
    type: MentorReviewChecklistDto,
  })
  mentorReviewChecklistsDto: MentorReviewChecklistDto;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;

  constructor(
    responseMentorReviewsPaginationResponseDto: MentorReviewsItemResponseDto,
  ) {
    Object.assign(this, responseMentorReviewsPaginationResponseDto);
  }
}
