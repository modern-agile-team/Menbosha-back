import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryListDto } from '../dto/category-list.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findOneCategoryOrNotFound(categoryId: number) {
    const category =
      await this.categoryRepository.findOneCategoryOrNotFound(categoryId);
    return new CategoryListDto(category);
  }
}
