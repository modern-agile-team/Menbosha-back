import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryListDto } from '../dto/category-list.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findOneCategoryOrNotFound(categoryId: number) {
    const category =
      await this.categoryRepository.findOneCategoryOrNotFound(categoryId);

    if (!category) {
      throw new NotFoundException('해당 category id가 존재하지 않습니다.');
    }

    return new CategoryListDto(category);
  }
}
