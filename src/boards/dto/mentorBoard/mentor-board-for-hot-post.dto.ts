import { ApiProperty, PickType } from '@nestjs/swagger';
import { MentorBoardDto } from './mentor-board.dto';
import { MentorBoardImage } from 'src/boards/entities/mentor-board-image.entity';
import { MentorBoardLikeDto } from './mentor-board-like.dto';
import { Exclude } from 'class-transformer';
import { UserForJoinDto } from 'src/users/dtos/user-for-join.dto';

/**
 * @todo 멘토 보드로 통합되면 dto명 수정 및 Property description 수정
 */

export class MentorBoardForHotPostDto extends PickType(MentorBoardDto, [
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

  constructor(mentorBoardForHotPostDto: Partial<MentorBoardForHotPostDto>) {
    const { mentorBoardImages } = mentorBoardForHotPostDto;

    super();
    Object.assign(this, mentorBoardForHotPostDto);

    this.body = mentorBoardForHotPostDto.body.substring(0, 30);
    this.likeCount = mentorBoardForHotPostDto.mentorBoardLikes.length;
    mentorBoardImages.length
      ? (this.imageUrl = mentorBoardImages[0].imageUrl)
      : (this.imageUrl = null);
  }
}
