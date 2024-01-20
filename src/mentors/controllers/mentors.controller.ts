import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';
import { MentorsService } from '../services/mentors.service';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}
  @Post(':mentorId/review')
  createMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Body() createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ) {
    return this.mentorsService.createMentorReview(
      userId,
      mentorId,
      createMentorReviewRequestBodyDto,
    );
  }
}
