import { Module } from '@nestjs/common';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';

@Module({
  controllers: [MentorsController],
  providers: [MentorsService]
})
export class MentorsModule {}
