import { ApiProperty } from '@nestjs/swagger';
import { CategoryList } from '@src/category/entity/category-list.entity';

export class CategoryListDto
  implements Pick<CategoryList, 'id' | 'categoryName'>
{
  @ApiProperty({
    description: '카테고리 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '카테고리 이름',
  })
  categoryName: string;

  constructor(categoryListDto: CategoryListDto) {
    Object.assign(this, categoryListDto);
  }
}
