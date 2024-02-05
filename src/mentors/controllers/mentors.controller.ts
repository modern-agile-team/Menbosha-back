import { Controller, Get, Query } from '@nestjs/common';
import { MentorListPageQueryDto } from 'src/users/dtos/mentor-list-page-query.dto';
import { MentorsService } from '../services/mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  findAllMentorsAndCount(
    @Query() mentorListPageQueryDto: MentorListPageQueryDto,
  ) {
    return this.mentorsService.findAllMentorsAndCount(mentorListPageQueryDto);
  }
}
