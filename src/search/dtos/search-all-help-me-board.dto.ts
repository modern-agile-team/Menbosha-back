import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SearchUserDto } from '@src/search/dtos/search-user-dto';
import { HelpMeBoard } from '@src/entities/HelpMeBoard';
import { Category } from '@src/entities/Category';

export class SearchAllHelpMeBoardDto
  implements
    Omit<
      HelpMeBoard,
      | 'category'
      | 'categoryId'
      | 'updatedAt'
      | 'user'
      | 'userId'
      | 'helpMeBoardImages'
      | 'helpYouComments'
      | 'pullingUp'
    >
{
  @ApiProperty({
    description: '도와주세요 게시글 고유 id',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '도와주세요 게시글 제목',
  })
  head: string;

  @ApiProperty({
    description: '도와주세요 게시글 본문. 30글자까지 자름',
    maxLength: 30,
  })
  body: string;

  @ApiProperty({
    description: '작성자 고유 id',
  })
  createdAt: Date;

  @ApiProperty({
    description: '게시글 작성자 정보를 매핑한 객체',
  })
  user: SearchUserDto;

  @ApiProperty({
    description: '도와주세요 게시판의 이미지 배열',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          description: '도와주세요 게시판의 이미지 url. 한개만 가져옴',
        },
      },
    },
  })
  helpMeBoardImages: { imageUrl: string }[] | [];

  @ApiProperty({
    description: '카테고리 리스트',
    type: 'object',
    properties: {
      name: {
        description: '카테고리의 이름',
        type: 'string',
      },
    },
  })
  category: Pick<Category, 'name'>;

  @ApiProperty({
    description: '끌어 올려진 시간',
    nullable: true,
    format: 'timestamp',
  })
  pullingUp: Date | null;

  @Exclude()
  deletedAt: Date;

  constructor(searchAllHelpMeBoardsDto: SearchAllHelpMeBoardDto) {
    this.id = searchAllHelpMeBoardsDto.id;
    this.head = searchAllHelpMeBoardsDto.head;
    this.body = searchAllHelpMeBoardsDto.body.substring(0, 30);
    this.createdAt = searchAllHelpMeBoardsDto.createdAt;
    this.user = searchAllHelpMeBoardsDto.user;
    this.helpMeBoardImages = searchAllHelpMeBoardsDto.helpMeBoardImages;
    this.category = searchAllHelpMeBoardsDto.category;
  }
}
