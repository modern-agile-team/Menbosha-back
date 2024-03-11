import { Injectable } from '@nestjs/common';
import { Category } from '@src/entities/Category';
import { EntityManager } from 'typeorm';

@Injectable()
export class CategoryRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findOneCategoryOrNotFound(categoryId: number) {
    return this.entityManager
      .getRepository(Category)
      .findOneBy({ id: categoryId });
  }
}
