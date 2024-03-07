import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MentorListPageQueryDto } from '@src/mentors/dtos/mentor-list-page-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { MentorPaginationResponseDto } from '@src/mentors/dtos/mentors-pagination-response.dto';
import { MentorsService } from '@src/mentors/services/mentors.service';
import { ApiFindAllMentorsAndCount } from '@src/mentors/swagger-decorators/find-all-mentors-and-count.decorator';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@ApiTags('mentor')
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
