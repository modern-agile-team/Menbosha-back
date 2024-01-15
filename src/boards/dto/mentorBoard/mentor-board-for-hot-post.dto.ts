import { ApiProperty, PickType } from '@nestjs/swagger';
import { MentorBoardDto } from './mentor-board.dto';
import { User } from 'src/users/entities/user.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { MentorBoardImage } from 'src/boards/entities/mentor-board-image.entity';
import { MentorBoardLikeDto } from './mentor-board-like.dto';
import { Exclude } from 'class-transformer';

class MentorBoardHotPostUserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    description: '이미지의 url',
  })
  imageUrl: string;
}

class MentorBoardHotPostUserDto implements Pick<User, 'name'> {
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: 'userImage 객체',
  })
  userImage: MentorBoardHotPostUserImageDto;
}

export class MentorBoardForHotPostDto extends PickType(MentorBoardDto, [
  'id',
  'userId',
  'head',
  'body',
  'categoryId',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    description: '멘토 게시판 인기 게시글 유저 정보 객체',
    type: MentorBoardHotPostUserDto,
  })
  user: MentorBoardHotPostUserDto;

  @Exclude()
  mentorBoardImages: MentorBoardImage[];

  @ApiProperty({
    description: '멘토 게시판 글 이미지 url',
    type: () => String,
    nullable: true,
  })
  imageUrl: string | null;

  @Exclude()
  mentorBoardLikes: MentorBoardLikeDto[];

  @ApiProperty({
    description: '좋아요 갯수',
    minimum: 10,
  })
  likeCount: number;

  constructor(mentorBoardForHotPostDto: Partial<MentorBoardForHotPostDto>) {
    const mentorBoardImages = mentorBoardForHotPostDto.mentorBoardImages;

    super();
    Object.assign(this, mentorBoardForHotPostDto);

    this.likeCount = mentorBoardForHotPostDto.mentorBoardLikes.length;
    mentorBoardImages.length
      ? (this.imageUrl = mentorBoardImages[0].imageUrl)
      : (this.imageUrl = null);
  }
}
