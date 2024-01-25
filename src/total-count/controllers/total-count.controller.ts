import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { TotalCountService } from '../services/total-count.service';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { Type } from '../enums/type.enum';
import { UpdateCountingDto } from '../dtos/update-counting.dto';
import { Action } from '../enums/action.enum';
import { ApiCounting } from '../swagger-decorators/counting.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('total-count')
@ApiTags('total-count API')
export class TotalCountController {
  constructor(private readonly totalCountService: TotalCountService) {}

  @ApiBearerAuth('access-token')
  @ApiCounting()
  @UseGuards(JwtAccessTokenGuard)
  @Patch('/counting')
  async counting(
    @GetUserId() userId: number,
    @Body() countingDto: UpdateCountingDto,
  ) {
    return await this.totalCountService.counting(
      userId,
      countingDto.mentorId as number,
      countingDto.type as Type,
      countingDto.action as Action,
    );
  }
}
