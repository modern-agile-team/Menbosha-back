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
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { MentorReviewsService } from '../services/mentor-reviews.service';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { ApiCreateMentorReview } from '../swagger-decorators/create-mentor-review.decorator';
import { ApiTags } from '@nestjs/swagger';
import { MentorReviewPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { ApiFindMentorReviews } from '../swagger-decorators/find-mentor-reviews.decorator';
import { ApiFindOneMentorReview } from '../swagger-decorators/find-one-mentor-review.decorator';
import { ApiDeleteMentorReview } from '../swagger-decorators/delete-mentor-review.decorator';
import { PatchUpdateMentorReviewDto } from '../dtos/patch-update-mentor-review.dto';
import { ApiPatchUpdateMentorReview } from '../swagger-decorators/patch-update-mentor-review.decorator';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@ApiTags('mentor')
@Controller('mentors/:mentorId/reviews')
export class MentorReviewsController {
  constructor(private readonly mentorsService: MentorReviewsService) {}

  @UseGuards(AccessTokenAuthGuard)
  @ApiCreateMentorReview()
  @Post()
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
  @Get()
  findMentorReviews(
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Query() mentorReviewPageQueryDto: MentorReviewPageQueryDto,
  ) {
    return this.mentorsService.findMentorReviews(
      mentorId,
      mentorReviewPageQueryDto,
    );
  }

  @ApiFindOneMentorReview()
  @Get(':reviewId')
  findOneMentorReview(
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
  ): Promise<MentorReviewDto> {
    return this.mentorsService.findOneMentorReview(mentorId, reviewId);
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiPatchUpdateMentorReview()
  @Patch(':reviewId')
  patchUpdateMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
    @Body() patchUpdateMentorReviewDto: PatchUpdateMentorReviewDto,
  ): Promise<MentorReviewDto> {
    return this.mentorsService.patchUpdateMentorReview(
      mentorId,
      userId,
      reviewId,
      patchUpdateMentorReviewDto,
    );
  }

  @UseGuards(AccessTokenAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteMentorReview()
  @Delete(':reviewId')
  deleteMentorReview(
    @GetUserId() userId: number,
    @Param('mentorId', ParsePositiveIntPipe) mentorId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
  ) {
    return this.mentorsService.deleteMentorReview(mentorId, userId, reviewId);
  }
}
