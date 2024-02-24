import { ApiProperty, PickType } from '@nestjs/swagger';
import { MentorBoardImage } from '@src/boards/entities/mentor-board-image.entity';
import { Exclude } from 'class-transformer';
import { UserForJoinDto } from '@src/users/dtos/user-for-join.dto';
import { MentorBoardDto } from '@src/boards/dto/mentorBoard/mentor-board.dto';
import { MentorBoardLikeDto } from '@src/boards/dto/mentorBoard/mentor-board-like.dto';

export class MentorBoardWithUserAndImageDto extends PickType(MentorBoardDto, [
  'id',
  'userId',
  'head',
  'body',
  'categoryId',
  'createdAt',
  'updatedAt',
  'popularAt',
]) {
  @ApiProperty({
    description: '멘토 게시판 글 유저 정보 객체',
    type: UserForJoinDto,
  })
  user: UserForJoinDto;

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
  })
  likeCount: number;

  constructor(
    mentorBoardWithUserAndImageDto: Partial<MentorBoardWithUserAndImageDto>,
  ) {
    const { mentorBoardImages } = mentorBoardWithUserAndImageDto;

    super();
    Object.assign(this, mentorBoardWithUserAndImageDto);

    this.body = mentorBoardWithUserAndImageDto.body.substring(0, 30);
    this.likeCount = mentorBoardWithUserAndImageDto.mentorBoardLikes.length;
    mentorBoardImages.length
      ? (this.imageUrl = mentorBoardImages[0].imageUrl)
      : (this.imageUrl = null);
  }
}
