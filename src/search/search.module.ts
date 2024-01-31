import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { BoardsModule } from 'src/boards/swagger-decorators/mentorBoard/boards.module';
import { SearchRepository } from './repositories/search.repository';

@Module({
  imports: [BoardsModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
})
export class SearchModule {}
