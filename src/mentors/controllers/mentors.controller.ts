import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MentorListPageQueryDto } from 'src/mentors/dtos/mentor-list-page-query.dto';
import { MentorsService } from '../services/mentors.service';
import { MentorPaginationResponseDto } from '../dtos/mentors-pagination-response.dto';
import { ApiFindAllMentorsAndCount } from '../swagger-decorators/find-all-mentors-and-count.decorator';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  @ApiFindAllMentorsAndCount()
  findAllMentorsAndCount(
    @Query() mentorListPageQueryDto: MentorListPageQueryDto,
  ): Promise<MentorPaginationResponseDto> {
    return this.mentorsService.findAllMentorsAndCount(mentorListPageQueryDto);
  }
}
