import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { TotalCountService } from '../services/total-count.service';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { Type } from '../enums/type.enum';
import { UpdateCountingDto } from '../dtos/update-counting.dto';
import { Action } from '../enums/action.enum';
import { ApiCounting } from '../swagger-decorators/counting.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('total-count')
@ApiTags('total-count API')
export class TotalCountController {
  constructor(private readonly totalCountService: TotalCountService) {}

  @ApiCounting()
  @UseGuards(AccessTokenAuthGuard)
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
