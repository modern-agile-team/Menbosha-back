import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { HelpMeBoardImage } from '@src/boards/entities/help-me-board-image.entity';
import { UserForJoinDto } from '@src/users/dtos/user-for-join.dto';
import { HelpMeBoardDto } from '@src/boards/dto/helpMeBoard/help-me-board.dto';

/**
 * @todo 도와주세요 보드로 통합되면 dto명 수정 및 Property description 수정
 */

export class HelpMeBoardWithUserAndImagesDto extends PickType(HelpMeBoardDto, [
  'id',
  'userId',
  'head',
  'body',
  'categoryId',
  'createdAt',
  'updatedAt',
  'pullingUp',
]) {
  @ApiProperty({
    description: '도와주세요 게시판 글 유저 정보 객체',
    type: UserForJoinDto,
  })
  user: UserForJoinDto;

  @Exclude()
  helpMeBoardImages: HelpMeBoardImage[];

  @ApiProperty({
    description: '도와주세요 게시판 글 이미지 url',
    type: () => String,
    nullable: true,
  })
  imageUrl: string | null;

  constructor(
    helpMeBoardWithUserAndImagesDto: Partial<HelpMeBoardWithUserAndImagesDto>,
  ) {
    const { helpMeBoardImages } = helpMeBoardWithUserAndImagesDto;

    super();
    Object.assign(this, helpMeBoardWithUserAndImagesDto);

    this.body = helpMeBoardWithUserAndImagesDto.body.substring(0, 30);
    helpMeBoardImages.length
      ? (this.imageUrl = helpMeBoardImages[0].imageUrl)
      : (this.imageUrl = null);
  }
}
