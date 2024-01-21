import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { ApiCreateMentorReview } from '../swagger-decorators/create-mentor-review.decorator';
import { ApiTags } from '@nestjs/swagger';
import { MentorBoardPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { ApiFindMentorReviews } from '../swagger-decorators/find-mentor-reviews.decorator';
import { ApiFindOneMentorReview } from '../swagger-decorators/find-one-mentor-review.decorator';
import { ApiRemoveMentorReview } from '../swagger-decorators/remove-mentor-review.decorator';
import { PatchUpdateMentorReviewDto } from '../dtos/patch-update-mentor-review.dto';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@ApiTags('mentors')
@Controller('mentors/:mentorId')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateMentorReview()
  @Post('reviews')
  createMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Body() createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
    return this.mentorsService.createMentorReview(
      mentorId,
      userId,
      createMentorReviewRequestBodyDto,
    );
  }

  @ApiFindMentorReviews()
  @Get('reviews')
  findMentorReviews(
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Query() mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ) {
    return this.mentorsService.findMentorReviews(
      mentorId,
      mentorBoardPageQueryDto,
    );
  }

  @ApiFindOneMentorReview()
  @Get('reviews/:reviewId')
  findOneMentorReview(
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
  ): Promise<MentorReviewDto> {
    return this.mentorsService.findOneMentorReview(mentorId, reviewId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch('reviews/:reviewId')
  patchUpdateMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
    @Body() patchUpdateMentorReviewDto: PatchUpdateMentorReviewDto,
  ) {
    return this.mentorsService.patchUpdateMentorReview(
      mentorId,
      userId,
      reviewId,
      patchUpdateMentorReviewDto,
    );
  }

  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveMentorReview()
  @Delete('reviews/:reviewId')
  removeMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
  ) {
    return this.mentorsService.removeMentorReview(mentorId, userId, reviewId);
  }
}
