import { Module } from '@nestjs/common';
import { BoardsModule } from '@src/boards/boards.module';
import { SearchController } from '@src/search/controllers/search.controller';
import { SearchRepository } from '@src/search/repositories/search.repository';
import { SearchService } from '@src/search/services/search.service';

@Module({
  imports: [BoardsModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
})
export class SearchModule {}
