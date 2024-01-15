import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { TotalCountService } from '../services/total-count.service';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@Controller('total-count')
export class TotalCountController {
  constructor(private readonly totalCountService: TotalCountService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Patch('/counting')
  async counting(
    @GetUserId() userId: number,
    @Body('mentorId') mentorId: number,
    @Body('type')
    type:
      | 'countMentorBoard'
      | 'countHelpYouComment'
      | 'countMentorBoardLike'
      | 'countBadge'
      | 'countReview',
    @Body('action') action: 'increment' | 'decrement',
  ) {
    return await this.totalCountService.counting(
      userId,
      mentorId,
      type,
      action,
    );
  }
}
