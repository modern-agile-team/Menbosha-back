import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { Exclude } from 'class-transformer';
import { HelpMeBoardDto } from './help-me-board.dto';
import { HelpMeBoardImage } from 'src/boards/entities/help-me-board-image.entity';

/**
 * @todo 도와주세요 보드로 통합되면 dto명 수정 및 Property description 수정
 */
class HelpMeBoardUserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    description: '이미지의 url',
  })
  imageUrl: string;
}

/**
 * @todo 도와주세요 보드로 통합되면 dto명 수정 및 Property description 수정
 */
class HelpMeBoardUserDto implements Pick<User, 'name'> {
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: 'userImage 객체',
  })
  userImage: HelpMeBoardUserImageDto;
}

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
    description: '도와주세요 게시판 인기 게시글 유저 정보 객체',
    type: HelpMeBoardUserDto,
  })
  user: HelpMeBoardUserDto;

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
