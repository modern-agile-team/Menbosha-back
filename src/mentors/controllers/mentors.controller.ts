import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';
import { MentorsService } from '../services/mentors.service';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';

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

  @UseGuards(JwtAccessTokenGuard)
  @Post(':mentorId/review')
  createMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Body() createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ) {
    console.log(createMentorReviewRequestBodyDto);

    return this.mentorsService.createMentorReview(
      mentorId,
      userId,
      createMentorReviewRequestBodyDto,
    );
  }
}
