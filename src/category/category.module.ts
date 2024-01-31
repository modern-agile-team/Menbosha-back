import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryList } from './entity/category-list.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryList])],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
