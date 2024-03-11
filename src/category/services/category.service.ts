import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from '@src/category/dto/category.dto';
import { CategoryRepository } from '@src/category/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findOneCategoryOrNotFound(categoryId: number) {
    const category =
      await this.categoryRepository.findOneCategoryOrNotFound(categoryId);

    if (!category) {
      throw new NotFoundException('해당 category id가 존재하지 않습니다.');
    }

    return new CategoryDto(category);
  }
}
