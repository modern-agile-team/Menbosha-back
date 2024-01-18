import { Injectable } from '@nestjs/common';
import { CategoryList } from 'src/common/entity/category-list.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CategoryRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findOneCategoryOrNotFound(categoryId: number) {
    return this.entityManager
      .getRepository(CategoryList)
      .findOneBy({ id: categoryId });
  }
}
