import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryList } from '@src/category/entity/category-list.entity';
import { CategoryRepository } from '@src/category/repositories/category.repository';
import { CategoryService } from '@src/category/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryList])],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
