import { ApiProperty } from '@nestjs/swagger';
import { UserImage } from '@src/entities/UserImage';
import { UserIntro } from '@src/entities/UserIntro';
import { MENTOR_REVIEW_REVIEW_LENGTH } from '@src/mentors/mentor-reviews/constants/mentor-review.constant';
import { MentorReviewDto } from '@src/mentors/mentor-reviews/dtos/mentor-review.dto';
import {
  USER_CAREER_LENGTH,
  USER_CUSTOM_CATEGORY_LENGTH,
  USER_NAME_LENGTH,
  USER_SHORT_INTRO_LENGTH,
} from '@src/users/constants/user.constant';
import { UserInfoDto } from '@src/users/dtos/user-info.dto';
import { Exclude } from 'class-transformer';

class UserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    default: '유저 image url',
  })
  imageUrl: string;
}

class UserIntroDto
  implements Pick<UserIntro, 'customCategory' | 'career' | 'shortIntro'>
{
  @ApiProperty({
    description: '커스텀 카테고리',
    minLength: USER_CUSTOM_CATEGORY_LENGTH.MIN,
    maxLength: USER_CUSTOM_CATEGORY_LENGTH.MAX,
  })
  customCategory: string;

  @ApiProperty({
    description: '유저 커리어',
    minLength: USER_CAREER_LENGTH.MIN,
    maxLength: USER_CAREER_LENGTH.MAX,
  })
  career: string;

  @ApiProperty({
    description: '멘토 소개',
    minLength: USER_SHORT_INTRO_LENGTH.MIN,
    maxLength: USER_SHORT_INTRO_LENGTH.MAX,
  })
  shortIntro: string;
}

class Mentee implements Pick<UserInfoDto, 'id' | 'name' | 'rank'> {
  @ApiProperty({
    description: '유저 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '유저 이름',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
  })
  name: string;

  @ApiProperty({
    description: '유저 랭크',
    format: 'integer',
  })
  rank: number;

  @ApiProperty({
    description: '유저 이미지 객체',
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
    minLength: MENTOR_REVIEW_REVIEW_LENGTH.MIN,
    maxLength: MENTOR_REVIEW_REVIEW_LENGTH.MAX,
  })
  review: string | null;

  @ApiProperty({
    description: '잘가르쳐요',
    default: false,
  })
  isGoodWork: boolean;

  @ApiProperty({
    description: '깔끔해요',
    default: false,
  })
  isClear: boolean;

  @ApiProperty({
    description: '답변이 빨라요',
    default: false,
  })
  isQuick: boolean;

  @ApiProperty({
    description: '정확해요',
    default: false,
  })
  isAccurate: boolean;

  @ApiProperty({
    description: '친절해요',
    default: false,
  })
  isKindness: boolean;

  @ApiProperty({
    description: '재밌어요',
    default: false,
  })
  isFun: boolean;

  @ApiProperty({
    description: '알차요',
    default: false,
  })
  isInformative: boolean;

  @ApiProperty({
    description: '아쉬워요',
    default: false,
  })
  isBad: boolean;

  @ApiProperty({
    description: '답답해요',
    default: false,
  })
  isStuffy: boolean;

  @ApiProperty({
    description: '이해가 잘돼요',
    default: false,
  })
  isUnderstandWell: boolean;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일자',
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(
    responseMentorReviewsPaginationResponseDto: MentorReviewsItemResponseDto,
  ) {
    Object.assign(this, responseMentorReviewsPaginationResponseDto);
  }
}
