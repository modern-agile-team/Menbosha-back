import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { CategoryList } from 'src/common/entity/category-list.entity';
import { SearchUserDto } from './search-user-dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchAllHelpMeBoardsDto
  implements
    Omit<
      HelpMeBoard,
      | 'categoryList'
      | 'categoryId'
      | 'updatedAt'
      | 'user'
      | 'userId'
      | 'helpMeBoardImages'
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
    description: '도와주세요 게시글 본문',
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
      categoryName: {
        description: '카테고리의 이름',
        type: 'string',
      },
    },
  })
  categoryList: Pick<CategoryList, 'categoryName'>;

  constructor(
    searchAllHelpMeBoardsDto: Partial<SearchAllHelpMeBoardsDto> = {},
  ) {
    this.id = searchAllHelpMeBoardsDto.id;
    this.head = searchAllHelpMeBoardsDto.head;
    this.body = searchAllHelpMeBoardsDto.body;
    this.createdAt = searchAllHelpMeBoardsDto.createdAt;
    this.user = searchAllHelpMeBoardsDto.user;
    this.helpMeBoardImages = searchAllHelpMeBoardsDto.helpMeBoardImages;
    this.categoryList = searchAllHelpMeBoardsDto.categoryList;
  }
}
