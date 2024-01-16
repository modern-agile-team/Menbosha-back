import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { TotalCountService } from '../services/total-count.service';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { Type } from '../enums/type.enum';
import { CountingDto } from '../dtos/counting.dto';
import { Action } from '../enums/action.enum';

@Controller('total-count')
export class TotalCountController {
  constructor(private readonly totalCountService: TotalCountService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Patch('/counting')
  async counting(
    @GetUserId() userId: number,
    @Body() countingDto: CountingDto,
  ) {
    return await this.totalCountService.counting(
      userId,
      countingDto.mentorId,
      countingDto.type as Type,
      countingDto.action as Action,
    );
  }
}
