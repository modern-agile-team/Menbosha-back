import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@src/entities/Category';

export class CategoryDto implements Pick<Category, 'id' | 'name'> {
  @ApiProperty({
    description: '카테고리 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '카테고리 이름',
  })
  name: string;

  constructor(categoryDto: CategoryDto) {
    Object.assign(this, categoryDto);
  }
}
